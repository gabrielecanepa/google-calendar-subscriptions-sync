import { resolve } from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration } from 'webpack'

const src = resolve(__dirname, 'src')
const build = resolve(__dirname, 'build')
const entry = resolve(src, 'index.ts')

const config: Configuration = {
  mode: 'production',
  target: 'node',
  entry,
  output: {
    filename: 'index.js',
    path: build,
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': src,
    },
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
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
}

export default config
