const path = require('path');
module.exports = {
  entry: './src/renderer/app.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'app.js',
    publicPath: ''
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  mode: 'production'
};
