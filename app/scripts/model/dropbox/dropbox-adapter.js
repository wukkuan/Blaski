define([
		'ember',
		'blaski-app',
		'model/file',
		'model/folder',
		'model/dropbox/dropbox-account'
	], function() {
		'use strict';

		Blaski.DropboxAdapter = Ember.Object.extend({
			dropboxAccount: Blaski.dropboxAccount,
			deferred: null,

			applyStat: function(context, stat) {
				if (!context.get('_meta.dropbox')) {
					context.set('_meta.dropbox', Ember.Object.create());
				}
				context.set('_meta.dropbox.stat', stat);

				context.setProperties({
					path: stat.path,
					name: stat.name
				});

				if (stat.isFile) {
					context.setProperties({
						size: stat.size,
						humanSize: stat.humanSize,
						modifiedAt: stat.modifiedAt
					});
				}
			},

			saveFile: function(context) {
				var dropboxAccount = this.get('dropboxAccount');
				var path = context.get('path');
				var data = context.get('data');
				var deferred = Ember.Object.create(Ember.Deferred);
				this.set('deferred', deferred);

				var self = this;
				context.setProperties({
					isSaving: true
				});
				dropboxAccount.get('client').writeFile(path, data, {}, function(error, stat) {
					if (error) {
						context.setProperties({
							isError: true,
							isSaving: false,
							lastError: new Error()
						});
						deferred.reject(self);
						console.warn('error while saving file');
						return;
					}
					self.applyStat(context, stat);
					context.setProperties({
						'persistedState.data': data,
						isError: false,
						isSaving: false,
						lastError: null
					});
					deferred.resolve(self);
				});

				return deferred;
			},

			saveFolder: function(context) {
				throw new Error("saveFolder not yet implemented.");
			},

			loadFile: function(context) {
				if (context.get('isLoading') || context.get('isSaving')) {
					return this.get('deferred');
				}
				var dropboxAccount = this.get('dropboxAccount');
				var path = context.get('path');
				var deferred = Ember.Object.create(Ember.Deferred);
				this.set('deferred', deferred);

				var self = this;
				context.set('isLoading', true);
				dropboxAccount.get('client').readFile(path,
					                     {},
					                     function(error, data, stat)
				{
					if (error) {
						context.setProperties({
							isError: true,
							lastError: new Error(),
							isDirty: true,
							isLoading: false,
							isLoaded: false
						});
						deferred.reject(self);
						console.warn("error loading file");
						return;
					}

					self.applyStat(context, stat);
					context.set('data', data);
					context.set('persistedState.data', data);
					context.set('_meta.dropbox.data', data);
					context.set('isLoading', false);
					context.set('isLoaded', true);
					deferred.resolve(self);
				});

				return deferred;
			},

			loadFolder: function(context) {
				var dropboxAccount = this.get('dropboxAccount');
				var path = context.get('path');

				var self = this;
				dropboxAccount.get('client').readdir(path,
					                     {},
					                     function(error, contents, stat, contentStats)
				{
					if (error) {
						return alert("error loading folder");
					}

					self.applyStat(context, stat);

					// Empty the files and folders arrays.
					context.get('files').length = 0;
					context.get('folders').length = 0;

					contentStats.forEach(function(contentStat) {
						var item;
						if (contentStat.isFile) {
							item = new Blaski.File();
							context.get("files").push(item);
						} else if (contentStat.isFolder) {
							item = new Blaski.Folder();
							context.get("folders").push(item);
						} else {
							throw new Error("Folder has non-file/folder content.");
						}
						self.applyStat(item, contentStat);
					});
				});
			}
		});
	}
);