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
					// Prepend a # onto all links.
					var processedData = data.replace(/\[(.*)\]\((.*)\)/, '[$1](#$2)');

					htmlData = converter.makeHtml(data);
				}
				return htmlData;
			}.property('data'),

			save: function() {
				var deferred = this.get('content').save();
				var self = this;
				deferred.then(
					function() {
						self.set('isEditing', false);
					},
					function() {
						alert('failed to save');
					}
				);
			},

			cancel: function() {
				this.set('isEditing', false);
				this.set('data', this.get('persistedState.data'));
			},

			edit: function() {
				this.set('isEditing', true);
			}
		});
	}
);
