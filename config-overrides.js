 
const webpack = require('webpack'); 
module.exports = function override(config) { 
		const fallback = config.resolve.fallback || {}; 
		Object.assign(fallback, { 
      "crypto": require.resolve("crypto-browserify"), 
      "stream": require.resolve("stream-browserify"), 
      "path": require.resolve("path-browserify"), 
      "http": require.resolve("stream-http"), 
      "https": require.resolve("https-browserify"),
      "fs": require.resolve('fs'),
      "timers": require.resolve("timers-browserify")
      }) 
    config.resolve.fallback = fallback; 
    config.plugins = (config.plugins || []).concat([ 
   	  new webpack.ProvidePlugin({ 
    	  process: 'process/browser', 
        Buffer: ['buffer', 'Buffer'] 
      }) 
    ])
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    }) 
   return config; 
  }
