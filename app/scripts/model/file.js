define([
		'ember',
		'blaski-app',
		'model/dropbox/dropbox-account'
	], function() {
		'use strict';

		Blaski.File = Ember.Object.extend({
			//TODO: Instead of using _meta, just use _adapter instances
			_meta: Ember.Object.create(),
			// First adapter is used for loading. All adapters used for saving.
			_adapter: null,

			persistedState: Ember.Object.create({
				data: undefined,
				name: undefined,
				path: undefined
			}),
			isLoaded: false,
			isLoading: false,
			isSaving: false,
			isError: false,
			lastError: null,

			isDirty: function() {
				return this.get('persistedState.data') !== this.get('data');
			}.property('persistedState.data', 'data'),

			path: null,
			name: null,
			data: null,

			// Size in bytes
			size: null,

			humanSize: null,

			// The time this file was last modified. Do not use to determine if a file
			// has been modified.
			modifiedAt: null,

			init: function() {
				this.set('persistedState', Ember.Object.create({
					data: undefined,
					name: undefined,
					path: undefined
				}));
			},

			save: function() {
				return this.get('_adapter').saveFile(this);
			},

			load: function() {
				return this.get('_adapter').loadFile(this);
			}

		});
	}
);