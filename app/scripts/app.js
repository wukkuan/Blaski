define([
		'blaski-app',
		'route/router',
		'model/dropbox/dropbox-account'
	], function() {
	'use strict';

	Blaski.initialize();
	Blaski.dropboxAccount.link();

});
