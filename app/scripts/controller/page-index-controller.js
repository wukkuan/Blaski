define([
		'ember',
		'blaski-app',
		'markdown-converter',
		'controller/page-index-tree-controller'
	], function() {
		'use strict';

		var converter = new Markdown.Converter();
		Blaski.PageIndexController = Ember.ObjectController.extend({
			pageIndexTreeController: function() {
				return Blaski.PageIndexTreeController.create({
					content: this.get('content')
				});
			}.property('content')
		});
	}
);
