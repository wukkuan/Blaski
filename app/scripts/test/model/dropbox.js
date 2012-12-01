define([
		'ember',
		'blaski-app',
		'dropbox',
		'model/dropbox/dropbox-account',
		'model/repository'
	], function() {
		'use strict';

		describe("Test Dropbox functionality", function() {
			/*jshint camelcase:false,
			  expr: true */
			var dropboxAccount = Blaski.dropboxAccount;
			var client = dropboxAccount.get('client');
			var _writeFile, _readFile, _readdir, _move, _mkdir;
			var _repositoryAdapterClass;

			beforeEach(function() {
				_writeFile = client.writeFile;
				_readFile = client.readFile;
				_readdir = client.readdir;
				_move = client.move;
				_mkdir = client.mkdir;
				_repositoryAdapterClass = Blaski.repository.get('adapterClass');
				Blaski.repository.set('adapterClass', Blaski.DropboxAdapter);
			});

			afterEach(function() {
				client.writeFile = _writeFile;
				client.readFile = _readFile;
				client.readdir = _readdir;
				client.move = _move;
				client.mkdir = _mkdir;
				Blaski.repository.set('adapterClass', _repositoryAdapterClass);
			});

			function prepare_writeFile_invalid() {
				client.writeFile = function(path, data, options, callback) {
					if (callback === undefined) {
						callback = options;
						options = {};
					}
					var error = new Dropbox.ApiError({
						status: 507,
						responseText: "Over quota (unit test)."
					}, 'GET', 'http://unittest.example.com');


					var stat = null;
					Ember.run.next(this, function() { callback(error, stat); });
				};
			}

			function prepare_writeFile_success() {
				client.writeFile = function(path, data, options, callback) {
					if (callback === undefined) {
						callback = options;
						options = {};
					}
					var stat = JSON.parse('{"path":"/hello_world.txt","name":"hello_world.txt","isFolder":false,"isFile":true,"isRemoved":false,"typeIcon":"page_white_text","modifiedAt":"2012-10-24T20:34:53.000Z","clientModifiedAt":"2012-10-24T20:34:53.000Z","inAppFolder":true,"size":14,"humanSize":"14 bytes","hasThumbnail":false,"versionTag":"10b31176a","mimeType":"text/plain"}');
					Ember.run.next(this, function() { callback(null, stat); });
				};
			}

			function prepare_readFile_success() {
				client.readFile = function(path, options, callback) {
					if (callback === undefined) {
						callback = options;
						options = {};
					}
					var error = null;
					var data = "hello world!";
					var stat = JSON.parse('{"path":"/hello_world.txt","name":"hello_world.txt","isFolder":false,"isFile":true,"isRemoved":false,"typeIcon":"page_white_text","modifiedAt":"2012-10-24T20:34:53.000Z","clientModifiedAt":"2012-10-24T20:34:53.000Z","inAppFolder":true,"size":14,"humanSize":"14 bytes","hasThumbnail":false,"versionTag":"10b31176a","mimeType":"text/plain"}');
					Ember.run.next(this, function() { callback(error, data, stat); });
				};
			}

			function prepare_readFile_invalid() {
				client.readFile = function(path, options, callback) {
					if (callback === undefined) {
						callback = options;
						options = {};
					}
					var error = new Dropbox.ApiError({
						status: 404,
						responseText: "File not found."
					}, 'GET', 'http://unittest.example.com');
					var data = null;
					var stat = null;
					Ember.run.next(this, function() { callback(error, data, stat); });
				};
			}

			function prepare_readdir_success() {
				client.readdir = function(path, options, callback) {
					if (callback === undefined) {
						callback = options;
						options = {};
					}
					var error = null;
					var filesAndFolderNames = ['dog', 'hello_world.txt', 'repository'];
					var statsJson = JSON.parse('[{"revision": 4, "rev": "40b31176a", "thumb_exists": false, "bytes": 0, "modified": "Wed, 24 Oct 2012 20:39:32 +0000", "path": "/dog", "is_dir": true, "icon": "folder", "root": "dropbox", "size": "0 bytes"}, {"revision": 1, "rev": "10b31176a", "thumb_exists": false, "bytes": 14, "modified": "Wed, 24 Oct 2012 20:34:53 +0000", "client_mtime": "Wed, 24 Oct 2012 20:34:53 +0000", "path": "/hello_world.txt", "is_dir": false, "icon": "page_white_text", "root": "dropbox", "mime_type": "text/plain", "size": "14 bytes"}, {"revision": 9, "rev": "90b31176a", "thumb_exists": false, "bytes": 0, "modified": "Sun, 04 Nov 2012 21:37:20 +0000", "path": "/repository", "is_dir": true, "icon": "folder", "root": "dropbox", "size": "0 bytes"}]');
					var stats = statsJson.map(function(stat) {
						return new Dropbox.Stat(stat);
					});
					var stat = new Dropbox.Stat(JSON.parse('{"hash": "46fa3a06254b5d74b7e7307a1a6c4a9b", "thumb_exists": false, "bytes": 0, "path": "/", "is_dir": true, "size": "0 bytes", "root": "app_folder", "contents": [{"revision": 4, "rev": "40b31176a", "thumb_exists": false, "bytes": 0, "modified": "Wed, 24 Oct 2012 20:39:32 +0000", "path": "/dog", "is_dir": true, "icon": "folder", "root": "dropbox", "size": "0 bytes"}, {"revision": 1, "rev": "10b31176a", "thumb_exists": false, "bytes": 14, "modified": "Wed, 24 Oct 2012 20:34:53 +0000", "client_mtime": "Wed, 24 Oct 2012 20:34:53 +0000", "path": "/hello_world.txt", "is_dir": false, "icon": "page_white_text", "root": "dropbox", "mime_type": "text/plain", "size": "14 bytes"}, {"revision": 9, "rev": "90b31176a", "thumb_exists": false, "bytes": 0, "modified": "Sun, 04 Nov 2012 21:37:20 +0000", "path": "/repository", "is_dir": true, "icon": "folder", "root": "dropbox", "size": "0 bytes"}], "icon": "folder"}') );
					Ember.run.next(this, function() {
						callback(error, filesAndFolderNames, stat, stats);
					});
				};
			}

			function prepare_readdir_invalid() {
				client.readdir = function(path, options, callback) {
					if (callback === undefined) {
						callback = options;
						options = {};
					}
					var error = new Dropbox.ApiError({
						status: 404,
						responseText: "File not found."
					}, 'GET', 'http://unittest.example.com');
					var filesAndFolderNames = null;
					var stats = null;
					var stat = null;
					Ember.run.next(this, function() {
						callback(error, filesAndFolderNames, stat, stats);
					});
				};
			}

			function prepare_move_success() {
				client.move = function(fromPath, toPath, callback) {
					var error = null;
					var stat = JSON.parse('{"path":"/hello_world_2.txt","name":"hello_world_2.txt","isFolder":false,"isFile":true,"isRemoved":false,"typeIcon":"page_white_text","modifiedAt":"2012-10-24T20:34:53.000Z","clientModifiedAt":"2012-10-24T20:34:53.000Z","inAppFolder":true,"size":14,"humanSize":"14 bytes","hasThumbnail":false,"versionTag":"10b31176a","mimeType":"text/plain"}');
					Ember.run.next(function() { callback(error, stat); });
				};
			}

			function prepare_move_invalid() {
				client.move = function(fromPath, toPath, callback) {
					var error = new Dropbox.ApiError({
						status: 404,
						responseText: "File not found."
					}, 'GET', 'http://unittest.example.com');
					var stat = null;
					Ember.run.next(function() { callback(error, stat); });
				};
			}

			function prepare_mkdir_success() {
				client.mkdir = function(path, callback) {
					var error = null;
					var stat = JSON.parse('{"path":"/hello_world_folder","name":"hello_world_folder","isFolder":true,"isFile":false,"isRemoved":false,"typeIcon":"page_white_text","modifiedAt":"2012-10-24T20:34:53.000Z","clientModifiedAt":"2012-10-24T20:34:53.000Z","inAppFolder":true,"size":14,"humanSize":"14 bytes","hasThumbnail":false,"versionTag":"10b31176a","mimeType":"text/plain"}');
					Ember.run.next(function() { callback(error, stat); });
				};
			}

			function prepare_mkdir_invalid() {
				client.mkdir = function(path, callback) {
					var error = new Dropbox.ApiError({
						status: 404,
						responseText: "File not found."
					}, 'GET', 'http://unittest.example.com');
					var stat = null;
					Ember.run.next(function() { callback(error, stat); });
				};
			}

			describe("Test the Dropbox.js custom testing functionality", function() {
				it("should handle errors", function(done) {
					prepare_writeFile_invalid();
					client.writeFile('testfile', 'test data', function(error) {
						expect(error).to.exist;
						done();
					});
				});

				it("should handle success", function(done) {
					prepare_writeFile_success();
					client.writeFile('testfile', 'test data', function(error) {
						expect(error).not.to.exist;
						done();
					});
				});
			});

			describe("Test dropbox-adapter", function() {
				describe("Test File", function() {
					it("should be dirty while writing and not before and after", function(done) {
						prepare_writeFile_success();
						var repo = Blaski.repository;
						var file = repo.getFile("/hello_world.txt");
						file.set('data', "this is test data");

						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.false;
						var deferred = file.save();
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.true;
						deferred.then(function() {
							expect(file.get('isSaving')).to.be.false;
							expect(file.get('isDirty')).to.be.false;
							expect(file.get('isError')).to.be.false;
							expect(file.get('lastError')).to.not.exist;
							expect(file.get('path')).to.exist;
							expect(file.get('name')).to.exist;
							expect(file.get('data')).to.exist;
							done();
						});
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.true;
					});

					it("should be dirty after failure to write file", function(done) {
						prepare_writeFile_invalid();
						var repo = Blaski.repository;
						var file = repo.getFile("/hello_world.txt");
						file.set('data', "this is test data");

						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.false;
						var deferred = file.save();
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.true;
						deferred.then(function() {}, function() {
							expect(file.get('isSaving')).to.be.false;
							expect(file.get('isDirty')).to.be.true;
							expect(file.get('isError')).to.be.true;
							expect(file.get('lastError')).to.exist;
							expect(file.get('path')).to.exist;
							expect(file.get('name')).to.exist;
							expect(file.get('data')).to.exist;
							done();
						});
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.true;
					});

					it("should read a file", function(done) {
						prepare_readFile_success();
						var repo = Blaski.repository;
						var file = repo.getFile("/hello_world.txt");

						expect(file.get('isLoading')).to.be.false;
						expect(file.get('isSaving')).to.be.false;
						expect(file.get('isLoaded')).to.be.false;
						expect(file.get('isDirty')).to.be.true;
						var deferred = file.load();
						expect(file.get('isLoading')).to.be.true;
						expect(file.get('isLoaded')).to.be.false;
						expect(file.get('isDirty')).to.be.true;
						deferred.then(function() {
							expect(file.get('isLoading')).to.be.false;
							expect(file.get('isSaving')).to.be.false;
							expect(file.get('isLoaded')).to.be.true;
							expect(file.get('isDirty')).to.be.false;
							expect(file.get('isError')).to.be.false;
							expect(file.get('lastError')).to.not.exist;
							expect(file.get('path')).to.exist;
							expect(file.get('name')).to.exist;
							expect(file.get('data')).to.exist;
							done();
						});
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isLoading')).to.be.true;
						expect(file.get('isLoaded')).to.be.false;
					});

					it("should be in the right state after an error when reading a file", function(done) {
						prepare_readFile_invalid();
						var repo = Blaski.repository;
						var file = repo.getFile("/hello_world.txt");

						expect(file.get('isLoading')).to.be.false;
						expect(file.get('isLoaded')).to.be.false;
						expect(file.get('isDirty')).to.be.true;
						var deferred = file.load();
						expect(file.get('isLoading')).to.be.true;
						expect(file.get('isLoaded')).to.be.false;
						expect(file.get('isDirty')).to.be.true;
						deferred.then(function() {}, function() {
							expect(file.get('isLoading')).to.be.false;
							expect(file.get('isLoaded')).to.be.false;
							expect(file.get('isDirty')).to.be.true;
							expect(file.get('isError')).to.be.true;
							expect(file.get('lastError')).to.exist;
							expect(file.get('path')).to.exist;
							expect(file.get('name')).to.exist;
							var data = file.get('data');
							expect(data).to.not.exist;
							done();
						});
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isLoading')).to.be.true;
						expect(file.get('isLoaded')).to.be.false;
					});

					it("should pass through the same deferred object when already loading a file", function() {
						prepare_readFile_success();
						var repo = Blaski.repository;
						var file = repo.getFile('/hello_world.txt');
						var deferred1 = file.load();
						var deferred2 = file.load();
						expect(deferred1).to.equals(deferred2);
					});

					it("should fail the deferred on the next runloop when saving while already loading or saving", function(done) {
						prepare_readFile_success();
						prepare_writeFile_success();
						var repo = Blaski.repository;
						var file = repo.getFile('/hello_world.txt');
						repo.set('data', "Hello world!");
						var deferredLoading = file.load();
						var deferredSaving = file.save();
						var loadingDone = false;
						// Note that technically the saving is supposed to fail, but that's
						// what we're considering done.
						var savingDone = false;
						deferredLoading.then(function() {
							loadingDone = true;
							if (savingDone) {
								done();
							}
						});
						deferredSaving.then(
							function() {
								// Do nothing.
							},
						  function() {
								savingDone = true;
								if (loadingDone) {
									done();
							}
						});
					});

					it('should successfully move a file when calling move.', function(done) {
						prepare_move_success();
						var repo = Blaski.repository;
						var file = repo.getFile("/hello_world.txt");
						file.set('data', "this is test data");

						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.false;
						var deferred = file.move('/hello_world_2.txt');
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.true;
						deferred.then(function() {
							expect(file.get('isSaving')).to.be.false;
							expect(file.get('isDirty')).to.be.false;
							expect(file.get('isError')).to.be.false;
							expect(file.get('lastError')).to.not.exist;
							expect(file.get('path')).to.exist;
							expect(file.get('name')).to.exist;
							expect(file.get('data')).to.exist;
							done();
						});
						expect(file.get('isDirty')).to.be.true;
						expect(file.get('isSaving')).to.be.true;
						done();
					});
				});

				describe('Test Folder', function() {
					it('should load a folder', function(done) {
						prepare_readdir_success();
						var repo = Blaski.repository;
						var folder = repo.getFolder('/');

						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
						var deferred = folder.load();
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.true;
						expect(folder.get('isLoaded')).to.be.false;
						deferred.then(function() {
							expect(folder.get('isDirty')).to.be.false;
							expect(folder.get('isLoading')).to.be.false;
							expect(folder.get('isLoaded')).to.be.true;
							done();
						});
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.true;
						expect(folder.get('isLoaded')).to.be.false;
					});

					it('should fail to load a folder and handle the error gracefully', function(done) {
						prepare_readdir_invalid();
						var repo = Blaski.repository;
						var folder = repo.getFolder('/');

						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
						var deferred = folder.load();
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.true;
						expect(folder.get('isLoaded')).to.be.false;
						deferred.then(
							function() {
								// Do nothing.
							},
							function() {
								expect(folder.get('isDirty')).to.be.true;
								expect(folder.get('isLoading')).to.be.false;
								expect(folder.get('isLoaded')).to.be.false;
								done();
							}
						);
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.true;
						expect(folder.get('isLoaded')).to.be.false;
					});

					it("should create folders as expected.", function(done) {
						prepare_mkdir_success();
						var repo = Blaski.repository;
						var folder = repo.getFolder('/');

						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
						var deferred = folder.create();
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
						expect(folder.get('isSaving')).to.be.true;
						deferred.then(function() {
							expect(folder.get('isSaving')).to.be.false;
							expect(folder.get('isDirty')).to.be.false;
							expect(folder.get('isLoading')).to.be.false;
							expect(folder.get('isLoaded')).to.be.true;
							done();
						});
						expect(folder.get('isSaving')).to.be.true;
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
					});

					it('should fail to create a folder and handle the error gracefully', function(done) {
						prepare_mkdir_invalid();
						var repo = Blaski.repository;
						var folder = repo.getFolder('/');

						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
						expect(folder.get('isSaving')).to.be.false;
						var deferred = folder.create();
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
						expect(folder.get('isSaving')).to.be.true;
						deferred.then(
							function() {
								// Do nothing.
							},
							function() {
								expect(folder.get('isSaving')).to.be.false;
								expect(folder.get('isDirty')).to.be.true;
								expect(folder.get('isLoading')).to.be.false;
								expect(folder.get('isLoaded')).to.be.false;
								done();
							}
						);
						expect(folder.get('isSaving')).to.be.true;
						expect(folder.get('isDirty')).to.be.true;
						expect(folder.get('isLoading')).to.be.false;
						expect(folder.get('isLoaded')).to.be.false;
					});

				});
			});
		});
	}
);