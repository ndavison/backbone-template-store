/**
 * Extends Backbone Views to include template retrieval and template caching. 
 * 
 * Nathan Davison <www.nathandavison.com>
 */

( function( root, factory ) {
	// Set up Backbone-relational for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'exports', 'backbone', 'underscore' ], factory );
	}
	// Next for Node.js or CommonJS.
	else if ( typeof exports !== 'undefined' ) {
		factory( exports, require( 'backbone' ), require( 'underscore' ) );
	}
	// Finally, as a browser global. Use `root` here as it references `window`.
	else {
		factory( root, root.Backbone, root._ );
	}
}( this, function( exports, Backbone, _ ) {

	"use strict";

	var _xhr = new XMLHttpRequest();
	var _templateCache = {};

	Backbone.View.prototype.getTemplate = function(templateURL, viewData, parser, callback) {

		viewData = viewData || {};
		parser = parser || function(){};
		callback = callback || function(){};
		var compileFromCache = function(templateURL, viewData) {
			var rawTemplate = _templateCache[templateURL] || '';
			var parsed = parser(rawTemplate);
			var compiled = parsed instanceof Function ? parsed(viewData) : rawTemplate;
			return compiled;
		};

		if (!_templateCache[templateURL]) {

			_xhr.open('GET', templateURL);
			_xhr.addEventListener('load', function() {
				_templateCache[templateURL] = this.responseText;
				callback(compileFromCache(templateURL, viewData));
			});
			_xhr.addEventListener('error', function() {
				console.log(this);
			});
			_xhr.send();

		} else {

			callback(compileFromCache(templateURL, viewData));

		}

	};

}));