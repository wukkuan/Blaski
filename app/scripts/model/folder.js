define([
		'ember',
		'blaski-app',
		'model/dropbox/dropbox-account'
	], function() {
		'use strict';

		Blaski.Folder = Ember.Object.extend({
			_meta: Ember.Object.create(),
			_adapter: null,
			_path: null,

			//TODO: isLoading and isLoaded should be changed to read only properties
			//and use "private" properties.
			isLoaded: false,
			isLoading: false,
			isSaving: false,
			isError: false,
			lastError: null,
			isDirty: true,

			path: function() {
				return this.get('_path');
			}.property('_path'),

			name: function() {
				var path = this.get('path');
				if (!path) {
					return path;
				} else if (path === '/') {
					return '';
				}
				var lastSlash = path.lastIndexOf('/');
				if (lastSlash === -1) {
					throw new Error('Path must include a slash.');
				}
				var name = path.substr(lastSlash + 1);
				return name;
			}.property('path'),

			files: null,
			folders: null,

			create: function() {
				return this.get('_adapter').createFolder(this);
			},

			load: function() {
				return this.get('_adapter').loadFolder(this);
			},

			init: function() {
				this.setProperties({
					files: Ember.ArrayProxy.create({ content: [] }),
					folders: Ember.ArrayProxy.create({ content: [] })
				});
			}
		});
	}
);
