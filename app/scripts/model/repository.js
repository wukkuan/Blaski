define([
		'ember',
		'blaski-app',
		'model/file',
		'model/folder',
		'model/dropbox/dropbox-account',
		'model/dropbox/dropbox-adapter'
	], function() {
		'use strict';

		Blaski.repository = Ember.Object.create({
			adapterClass: Blaski.DropboxAdapter,

			getFolder: function(path) {
				return Blaski.Folder.create({
					_adapter: this.get('adapterClass').create(),
					path: path
				});
			},

			getFile: function(path) {
				var lastSlash = path.lastIndexOf('/');
				if (lastSlash === -1) {
					throw new Error('Path must include a slash.');
				}
				var name = path.substr(lastSlash + 1);
				return Blaski.File.create({
					_adapter: this.get('adapterClass').create(),
					path: path,
					name: name
				});
			}
		});
	}
);