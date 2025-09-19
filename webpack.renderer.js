const path = require('path');

module.exports = {
  target: 'electron-renderer',
  entry: './src/renderer/app.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json'
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  externals: {
    '@overwolf/ow-electron': 'commonjs @overwolf/ow-electron'
  }
};
