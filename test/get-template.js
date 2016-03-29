/**
 * Tests the template store's ability to retrieve a template.
 */
describe('Backbone Template Store', function() {
	
	var server;

	beforeEach('setup the XHR mock', function() {
		server = sinon.fakeServer.create();
		server.respondImmediately = true;
	});

	afterEach('restore normal XHR', function() {
		server.restore();
	});

	describe('Cache', function() {
		
		it("should get the fake XHR response on first request.", function(done) {

			server.respondWith('This is the first XHR response.');
			var callback = sinon.spy();

			var View = Backbone.View.extend({
				render: function() {
					this.getTemplate('fake.html', {value: ''}, _.template, callback);
				}
			});
			var view = new View();
			view.render();
			callback.callCount.should.equal(1);
			done();
		});

		it("should still get the first fake XHR response on the second request despite changing the server response.", function(done) {
			
			var expected = 2;
			var runs = 0;

			server.respondWith('This is the first XHR response.');
			var callback = sinon.spy();

			var View = Backbone.View.extend({
				render: function() {
					this.getTemplate('fake.html', {value: ''}, _.template, callback);
				}
			});
			var view = new View();
			view.render();
			callback.callCount.should.equal(1);

			server.respondWith('This is the second XHR response');
			var view2 = new View();
			view.render();
			callback.callCount.should.equal(2);
			callback.args[0][0].should.equal('This is the first XHR response.');
			callback.args[1][0].should.equal('This is the first XHR response.');
			done();

		});
	});

	describe('Compilation', function() {

		it("should use the Underscore template method to interpolate a value into the template string.", function(done) {

			server.respondWith('This is the first XHR response with <%- value %>.');
			var callback = sinon.spy();

			var View = Backbone.View.extend({
				render: function() {
					this.getTemplate('fake-with-interpolation.html', {value: 'extra'}, _.template, callback);
				}
			});
			var view = new View();
			view.render();
			callback.callCount.should.equal(1);
			callback.args[0][0].should.equal('This is the first XHR response with extra.');
			done();
		});

	});

	describe('Error Handling', function() {

		it("should execute the error callback when a 404 is encountered when retrieving the template.", function(done) {

			server.respondWith([404, {}, '']);
			var callback = sinon.spy();
			var errorCallback = sinon.spy();

			var View = Backbone.View.extend({
				render: function() {
					this.getTemplate('fake-bad-url.html', {value: 'extra'}, _.template, callback, errorCallback);
				}
			});
			var view = new View();
			view.render();
			callback.callCount.should.equal(0);
			errorCallback.callCount.should.equal(1);
			done();
		});

	});
});