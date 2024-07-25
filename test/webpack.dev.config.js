/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const { DefinePlugin } = require('webpack');
const devServerMocker = require("../scripts/dev-server-mocker");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const dev = {
  entry: {
    dev: path.resolve(__dirname, 'test/index.ts'),
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    // new MonacoWebpackPlugin({
    //   languages: ['json'],
    // }),
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    setupMiddlewares: devServerMocker({
      enable: !!process.env.IS_MOCK, // mock开关
      mockPath: path.resolve(__dirname, '../mock'),
      patterns: [/\/trpc.ssad.ad_diagnose./,'/\/api\//'], // api path匹配规则
      logger: true,
    }),
    port: 8081,
    client: {
      overlay: true,
    },
    open: true,
    allowedHosts: ['all'],
    historyApiFallback: true,
    // proxy: {
    //   '/trpc.ssad.ad_diagnose.': {
    //     target: 'https://test-sgb.woa.com/trpc.ssad.ad_diagnose.',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/trpc.ssad.ad_diagnose.*': '/trpc.ssad.ad_diagnose.*',
    //     },
    //   },
    // }
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, '../src/'),
  },
  mode: 'development',
};

module.exports = merge(base, dev);
