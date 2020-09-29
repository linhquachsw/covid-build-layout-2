/* eslint-disable no-param-reassign */
const { LOCAL, ANALYZE, REACT_APP_API_URL, REACT_APP_AUTH_API_URL, NODE_ENV } = process.env;

const path = require('path');
const withTM = require('next-transpile-modules')(['@next-zero/framework', 'react-sortable-tree']);
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: ANALYZE === 'true',
});
const { version: VERSION } = require('./package.json');

const nextConfig = {
  // target: 'serverless',
  env: {
    REACT_APP_API_URL,
    REACT_APP_AUTH_API_URL,
    VERSION,
    IS_PROD: NODE_ENV === 'production',
    LOCAL,
  },
  // eslint-disable-next-line no-unused-vars
  webpack(config, opts) {
    config.resolve.alias.App = path.join(__dirname, 'src');
    config.node = {
      fs: 'empty',
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(withSass(withTM(nextConfig)));
