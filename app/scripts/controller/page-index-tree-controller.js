define([
		'ember',
		'blaski-app'
	], function() {
		'use strict';

		var converter = new Markdown.Converter();
		Blaski.PageIndexTreeController = Ember.ObjectController.extend({
			isEmpty: function() {
				return this.get('files.length') === 0
					&& this.get('folders.length') === 0;
			}.property('content.files.length', 'content.folders.length'),

			subfolderControllers: function() {
				return this.get('folders').map(function(folder) {
					folder.load();
					return Blaski.PageIndexTreeController.create({
						content: folder
					});
				});
			}.property('content.folders.@each')
		});
	}
);
