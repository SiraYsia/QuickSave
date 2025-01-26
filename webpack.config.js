const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: './src/popup.tsx',
    background: './src/background.ts',
    content: './src/content.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'src/styles')
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/popup.html',
          to: 'popup.html'
        },
        { from: 'src/styles', to: 'styles' },
        { from: 'manifest.json' },
        // Copy icons with exact paths
        { 
          from: 'public/icons/favicon-16x16.png',
          to: 'icons/favicon-16x16.png'
        },
        {
          from: 'public/icons/favicon-48x48.png',
          to: 'icons/favicon-48x48.png'
        },
        {
          from: 'public/icons/favicon-128x128.png',
          to: 'icons/favicon-128x128.png'
        }
      ],
    }),
  ],
};