const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const devServerMocker = require("/Users/runzhi/IdeaProjects/demo/webpack-dev-server-mocker/dist/index.js");

module.exports =  {
  mode: 'development',
  entry: {
    dev: path.resolve(__dirname, 'index.ts'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: "all",
      template: './test/index.html',
    }),
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    setupMiddlewares: devServerMocker({
      enable: true, // mock开关
      mockPath: 'mock',
      patterns: [/\/webapi./,/\/api\//], // api path匹配规则
      logger: true,
    }),
    port: 3838,
    client: {
      overlay: true,
    },
    open: true,
    allowedHosts: ['all'],
    historyApiFallback: true
  },
  output: {
    filename: '[name].js',
  },
};

