const path = require('path')

const HtmlWebpackPulgin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: 'js/[contenthash].js'
  },
  mode: 'development',

  plugins: [
    new HtmlWebpackPulgin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],
  devServer: {
    static: './dist'
  },
}