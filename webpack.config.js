var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = function (env) {
  env = {
    production: process.env.NODE_ENV.toLowerCase() === 'production'
  };

  var plugins = [
    new CopyWebpackPlugin([
      { from: 'index.html', to: 'dist/index.html' },
      { from: 'data.json', to: 'dist/data.json' },
      { from: 'options.json', to: 'dist/options.json'},
      { from: 'src/img', to: env && env.production ? 'dist/img' : 'img' },
      { from: 'src/js', to: env && env.production ? 'dist/js' : 'js' },
      { from: 'src/css', to: env && env.production ? 'dist/css' : 'css' }
    ])
  ];

  var devServer = {
    overlay: {
      warning: false,
      error: true
    }
  };

  if (env.production) {
    plugins.push(new UglifyJSPlugin({
      comments: false,
      compress: {
        drop_console: true
      }
    }));
  }

  if (!env.production) {
    plugins.push(new FriendlyErrorsPlugin())
  }

  return {
    entry: './src/main.js',
    output: {
      filename: env && env.production ? 'dist/js/main.js' : 'js/main.js',
      libraryTarget: 'var',
    },
    devtool: env && env.production ? '' : 'cheap-eval-source-map',
    devServer: devServer,
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            quiet: !env.production,
            formatter: require('eslint-friendly-formatter')
          }
        },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        {
          test: /\.css$/, exclude: /node_modules/, use: ['style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          }, 'postcss-loader']
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
          }
        }
      ]
    },
    plugins: plugins
  }
};
