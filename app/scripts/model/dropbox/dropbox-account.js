define([
		'ember',
		'blaski-app',
		'dropbox'
	], function() {
		'use strict';

		Blaski.dropboxAccount = Ember.Object.create({
			isLinked: false,

			client: new Dropbox.Client({
				key: 'R5mlbFNuqWA=|vm7yKHR7EVB3yowiVvlx8WX3uwz5jqQaqnEqkNAUdA==',
				sandbox: true
			}),

			link: function() {
				var client = this.get('client');
				var self = this;
				client.authDriver(new Dropbox.Drivers.Redirect({
					rememberUser: true
				}));
				client.authenticate(function(error, client) {
					if (error) {
						return alert("Error while authenticating");
					}

					self.set('isLinked', true);
				});
			}
		});
	}
);