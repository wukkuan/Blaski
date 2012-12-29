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
					var processedData = data.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '[$1](#$2)');

					htmlData = converter.makeHtml(processedData);
				}
				return htmlData;
			}.property('data'),

			save: function() {
				var deferred = this.get('content').save();
				var self = this;
				deferred.then(
					function() {
						//TODO: Notify user that the save finished.
					},
					function() {
						alert('failed to save');
					}
				);
			},

			close: function() {
				var data = this.get('data');
				var persistedData = this.get('persistedState.data');
				if (data !== persistedData) {
					if (confirm('You have unsaved changes. Are you sure you want to abandon them?')) {
						this.set('isEditing', false);
						this.set('data', this.get('persistedState.data'));
					}
				} else {
					this.set('isEditing', false);
				}
			},

			edit: function() {
				this.set('isEditing', true);
			}
		});
	}
);
