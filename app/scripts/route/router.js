define([
		'ember',
		'blaski-app',
		'controller/application-controller',
		'view/application-view',
		'controller/page-controller',
		'view/page-view',
		'controller/page-index-controller',
		'view/page-index-view',
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

				pageIndex: Ember.Route.extend({
					route: '/index/*pagePath',

					serialize: function(router, context) {
						console.log('serializing index');
						return context;
					},

					deserialize: function(router, context) {
						console.log('deserializing index');
						return context;
					},

					connectOutlets: function(router, context) {
						var appCtrlr = router.get('applicationController');
						var folder = Blaski.repository.getFolder('/repository/' + context.pagePath);
						appCtrlr.connectOutlet('body', 'pageIndex', folder);
						var folderPromise = folder.load();
						folderPromise.then(
							function() {
								// folder;
								// debugger;
								console.log('index load success');
							},
							function() {
								console.log('index load failed');
							}
						);
					}

				}),

				rootIndex: Ember.Route.extend({
					route: '/index-root',

					connectOutlets: function(router, context) {
						var appCtrlr = router.get('applicationController');
						var folder = Blaski.repository.getFolder('/repository');
						appCtrlr.connectOutlet('body', 'pageIndex', folder);
						var folderPromise = folder.load();
						folderPromise.then(
							function() {
								// folder;
								// debugger;
								console.log('index load success');
							},
							function() {
								console.log('index load failed');
							}
						);
					}
				}),

				pageRoute: Ember.Route.extend({
					route: '/page/*pagePath',

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
