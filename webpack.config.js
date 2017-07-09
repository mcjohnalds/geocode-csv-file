var webpack = require('webpack');

module.exports = {
  entry: './src/client',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  devtool: process.env.NODE_ENV === 'production' ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              "react",
              "stage-2",
              ["env", {
                "targets": {
                  "browsers": "last 2 versions"
                },
                "useBuiltIns": true
              }]
            ],
            "plugins": ["transform-class-properties"]
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }  
          }
        ]
      }
    ]
  },
  plugins: [
    // Make NODE_ENV available to frontend js
    // Apparently some frontend packages pay attention to this
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
