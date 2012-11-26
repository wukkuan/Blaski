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
				return Blaski.File.create({
					_adapter: this.get('adapterClass').create(),
					_path: path,
				});
			}
		});
	}
);