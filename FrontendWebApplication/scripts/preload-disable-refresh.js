#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Preload hook that disables @pmmmwh/react-refresh-webpack-plugin and its loader
 * during production builds by returning no-op stubs from require().
 * This avoids executing any internals that might reference legacy validateOptions.
 */
const Module = require('module');

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  // Do nothing in dev
  return;
}

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@pmmmwh/react-refresh-webpack-plugin' || request === '@pmmmwh/react-refresh-webpack-plugin/loader') {
    // Return a no-op class for plugin and a passthrough for loader
    if (request.endsWith('/loader')) {
      return function noOpLoader(source) { return source; };
    }
    class NoopReactRefreshWebpackPlugin {
      /** PUBLIC_INTERFACE */
      constructor() {}
      /** PUBLIC_INTERFACE */
      apply() {}
    }
    return NoopReactRefreshWebpackPlugin;
  }
  return originalLoad.apply(this, arguments);
};
