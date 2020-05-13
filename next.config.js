const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withImages = require('next-images');
const withPWA = require('next-pwa');
const Dotenv = require('dotenv-webpack');
const path = require('path');

require('dotenv').config();

// eslint-disable-next-line
const isProd = process.env.NODE_ENV === 'production';

const handleWebpackPlugins = (config) => {
  config.plugins = config.plugins || [];

  config.plugins = [
    ...config.plugins,

    // Read the .env file
    new Dotenv({
      path: path.join(__dirname, '.env'),
      systemvars: true,
    }),
  ];

  return config;
};

module.exports = withImages(
  withBundleAnalyzer(
    withPWA({
      analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: 'static',
          reportFilename: '../bundles/server.html',
        },
        browser: {
          analyzerMode: 'static',
          reportFilename: '../bundles/client.html',
        },
      },
      webpack(config) {
        handleWebpackPlugins(config);
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
          include: path.resolve(__dirname, 'src/assets/icons'),
        });
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
      },
      pwa: {
        dest: 'public',
        disable: !isProd,
      },
    })
  )
);
