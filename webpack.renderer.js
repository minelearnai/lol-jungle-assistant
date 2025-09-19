const path = require('path');

module.exports = {
  entry: './src/renderer/app.tsx',
  mode: process.env.NODE_ENV || 'development',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'app.js',
    clean: true,
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  stats: {
    errorDetails: true,
  },
  // For Overwolf/Electron compatibility
  externals: {
    electron: 'commonjs electron',
  },
};