define([
		'text!template/page.hbs',
		'ember',
		'blaski-app'
	], function(pageTemplate) {
		'use strict';

		Blaski.PageView = Ember.View.extend({
			template: Ember.Handlebars.compile(pageTemplate)
		});
	}
);