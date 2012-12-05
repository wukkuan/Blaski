require.config({
	shim: {
		'handlebars': {
			exports: 'Handlebars'
		},
		'ember': {
			deps: [ 'jquery', 'handlebars' ],
			exports: 'Ember'
		},
		'ember-data': {
			deps: [ 'ember' ],
			exports: 'DS'
		},
		'dropbox': {
			exports: 'Dropbox'
		},
		'markdown-converter': {
			exports: 'Markdown'
		}
	},

	paths: {
		'jquery': 'vendor/jquery.min',
		'ember': 'vendor/ember-1.0.0-pre.2',
		'ember-data': 'vendor/ember-data-latest',
		'handlebars': 'vendor/handlebars-latest',
		'dropbox': 'vendor/dropbox-latest',
		'markdown-converter': 'vendor/Markdown.Converter'
	}
});

require(['app'], function(app) {
});