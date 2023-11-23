import { resolve } from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration } from 'webpack'

const config: Configuration = ({
  mode: 'production',
  target: 'node',
  entry: resolve(__dirname, 'src', 'index.ts'),
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
})

export default config
