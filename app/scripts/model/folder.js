define([
		'ember',
		'blaski-app',
		'model/dropbox/dropbox-account'
	], function() {
		'use strict';

		Blaski.Folder = Ember.Object.extend({
			_meta: Ember.Object.create(),
			// First adapter is used for loading. All adapters used for saving.
			_adapter: null,

			isLoaded: false,
			isLoading: false,

			path: null,
			name: null,
			files: [],
			folders: [],

			//TODO: Use deferreds.
			save: function() {
				this.get('_adapter').saveFolder(this);
			},

			//TODO: Use deferreds.
			load: function() {
				this.get('_adapter').loadFolder(this);
			}
		});
	}
);