const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'application.js', // match Shopify default
    path: path.resolve(__dirname, 'assets'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,          // handles .js files
        exclude: /node_modules/,  // skip packages
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
    ],
  },
  watch: true,
  devtool: 'source-map',
};
