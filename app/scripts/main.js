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
    }
  },

  paths: {
    'jquery': 'vendor/jquery.min',
    'ember': 'vendor/ember-latest',
    'ember-data': 'vendor/ember-data-latest',
    'handlebars': 'vendor/handlebars-latest'
  }
});

require(['app'], function(app) {
  // use app here
  console.log(app);
});