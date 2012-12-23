define([
		'text!template/page-index-tree.hbs',
		'ember',
		'blaski-app'
	], function(pageIndexTreeTemplate) {
		'use strict';

		Blaski.PageIndexTreeView = Ember.View.extend({
			template: Ember.Handlebars.compile(pageIndexTreeTemplate),
		});
	}
);
