'use strict';

var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/helpers/**/*.js',
      'test/spec/components/**/*.js',
      'test/spec/models/**/*.js',

      {
        pattern: 'test/data/*',
        watched: true,
        included: false,
        served: true
      }
    ],
    preprocessors: {
      'test/spec/components/**/*.js': ['webpack'],
      'test/spec/models/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        loaders: [{
          test: /\.gif/,
          loader: 'url-loader?limit=10000&mimetype=image/gif'
        }, {
          test: /\.jpg/,
          loader: 'url-loader?limit=10000&mimetype=image/jpg'
        }, {
          test: /\.png/,
          loader: 'url-loader?limit=10000&mimetype=image/png'
        }, {
          test: /\.js$/,
          loader: 'jsx-loader?harmony'
        }, {
          test: /\.less/,
          loader: 'style-loader!css-loader!less-loader'
        }, {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }]
      },
      resolve: {
        alias: {
          'styles': path.join(process.cwd(), './src/styles/'),
          'components': path.join(process.cwd(), './src/scripts/components/'),
          'models': path.join(process.cwd(), './src/scripts/models/')
        }
      }
    },
    webpackServer: {
      stats: {
        colors: true
      }
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    captureTimeout: 60000,
    singleRun: true,
    client: {
      captureConsole: true
    }
  });
};
