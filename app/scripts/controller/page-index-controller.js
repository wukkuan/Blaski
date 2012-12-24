define([
		'ember',
		'blaski-app',
		'controller/page-index-tree-controller'
	], function() {
		'use strict';

		Blaski.PageIndexController = Ember.ObjectController.extend({
			pageIndexTreeController: function() {
				return Blaski.PageIndexTreeController.create({
					content: this.get('content')
				});
			}.property('content')
		});
	}
);
