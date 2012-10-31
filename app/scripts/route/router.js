define([
		'ember',
		'blaski-app',
		'controller/application-controller',
		'view/application-view',
		'controller/page-controller',
		'view/page-view'
	], function() {
		'use strict';

		Blaski.Router = Ember.Router.extend({
			enableLogging: true,

			root: Ember.Route.extend({
				index: Ember.Route.extend({
					route: '/',

					connectOutlets: function(router) {
						var appCtrlr = router.get('applicationController');
						appCtrlr.connectOutlet('body', 'page');
					}
				})
			})
		});

	}
);