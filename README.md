# backbone-template-store

Extends Backbone Views to include template retrieval (via XMLHttpRequest GET) and template caching. 

# Usage

```
npm install backbone-template-store
```

Make sure Backbone is already loaded on the page:

```html
<script src="node_modules/backbone/backbone-min.js" type="text/javascript"></script>
<script src="node_modules/backbone-template-store/backbone-template-store-min.js" type="text/javascript"></script>
```

The `getTemplate()` method can now be used when rendering a View:

```javascript
var TestView = Backbone.View.extend({
	el: "div#test",
	initialize: function(){
		this.render();
	},
	render: function() {
		var view = this;
		this.getTemplate('templates/test.html', {value: "Hello!"}, _.template, function(compiled) {
			view.$el.html(compiled);
		});
	}
});
var testView1 = new TestView();
```

In this example, the test view uses the `getTemplate()` method to get the `templates/test.html` template from the server, passes in an object for the view data, and uses Underscore's `_.template()` method as the compiler, which pairs the template with the view data and produces the `compiled` var, provided to the callback argument. You can use any template compiling method provided the argument provided to `getTemplate()` is a function which itself returns a function, that accepts the view data as its argument. E.g.:

```javascript
var MyCompiler = function(template) {
	return function(viewData) {
		var compiled = ""; // logic for pairing the template and data here
		return compiled;
	};
};
```

In this example, `MyCompiler` can be passed directly, e.g.:

```javascript
this.getTemplate('templates/test.html', {value: "Hello!"}, MyCompiler, function(compiled) {})
```
