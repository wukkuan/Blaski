define([
		'ember',
		'blaski-app',
		'markdown-converter'
	], function() {
		'use strict';

		var converter = new Markdown.Converter();
		Blaski.PageController = Ember.ObjectController.extend({
			isEditing: false,
			htmlData: function() {
				var data = this.get('data');
				var htmlData = data;
				if (data) {
					htmlData = converter.makeHtml(data);
				}
				return htmlData;
			}.property('data')
		});
	}
);