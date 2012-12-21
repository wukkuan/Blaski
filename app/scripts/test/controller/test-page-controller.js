define([
		'ember',
		'blaski-app',
		'controller/page-controller',
		'model/file'
	], function() {
		'use strict';

		describe("Test page-controller functionality", function() {
			/*jshint camelcase:false,
			  expr: true */

			var pageController = Blaski.PageController.create({});
			beforeEach(function() {
				pageController.set('content', Blaski.File.create({
				}));
			});

			afterEach(function() {
			});

			describe("Defaults", function() {
				it("should have expected defaults", function() {
					expect(pageController.get('isEditing')).to.be.false;
				});
			});

		});
	}
);