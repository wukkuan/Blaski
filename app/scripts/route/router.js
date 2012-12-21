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
			location: 'hash',

			root: Ember.Route.extend({
				index: Ember.Route.extend({
					route: '/',

					connectOutlets: function(router) {
						var appCtrlr = router.get('applicationController');
						var index = Blaski.repository.getFile('/repository/index.md');
						index.load();
						appCtrlr.connectOutlet('body', 'page', index);
					}

				}),

				pageRoute: Ember.Route.extend({
					route: '/*pagePath',

					connectOutlets: function(router, context) {
						console.log('connectOutlets', context);
						var appCtrlr = router.get('applicationController');
						var file = Blaski.repository.getFile('/repository/' + context.pagePath + '.md');
						file.load();
						appCtrlr.connectOutlet('body', 'page', file);
					},

					deserialize: function(router, params) {
						console.log('deserialize', params);
						// var index = Blaski.repository.getFile('/repository/' + params.pageName + '.md');
						// index.load();
						return params;
					},

					serialize: function(router, context) {
						console.log('serialize', context);
						return context;
					}

				})
			})
		});

	}
);
