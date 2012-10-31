define([
		'ember',
		'blaski-app'
	], function() {
		'use strict';

		Blaski.PageController = Ember.Controller.extend({
			isEditing: false,
			text: "This is a page!"
		});
	}
);