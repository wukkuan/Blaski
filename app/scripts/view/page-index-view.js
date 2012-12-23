define([
		'text!template/page-index.hbs',
		'ember',
		'blaski-app',
		'view/page-index-tree-view'
	], function(
		pageIndexTemplate
	) {
		'use strict';

		Blaski.PageIndexView = Ember.View.extend({
			template: Ember.Handlebars.compile(pageIndexTemplate),
		});
	}
);
