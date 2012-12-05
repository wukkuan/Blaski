define([
		'ember',
		'blaski-app',
		'controller/application-controller',
		'view/application-view',
		'controller/page-controller',
		'view/page-view',
		'model/repository'
	], function() {
		'use strict';

		Blaski.Router = Ember.Router.extend({
			enableLogging: true,

			root: Ember.Route.extend({
				index: Ember.Route.extend({
					route: '/',

					connectOutlets: function(router) {
						var appCtrlr = router.get('applicationController');
						var index = Blaski.repository.getFile('/repository/index.md');
						index.load();
						appCtrlr.connectOutlet('body', 'page', index);
					}
				})
			})
		});

	}
);