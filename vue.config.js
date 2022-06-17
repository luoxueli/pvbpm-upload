const path = require('path')

module.exports =
  process.env.NODE_ENV === 'development'
    ? {
        pages: {
          index: {
            entry: './src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
          }
        },
        devServer: {
          port: 8080,
          hot: true,
          open: true,
          disableHostCheck: true,
          proxy: {
            '/api': { target: 'http://172.29.234.19:8080', ws: true, pathRewrite: { '^/api': '/' } }
          }
        }
      }
    : {
        chainWebpack: config => {
          config.externals({
            vue: 'Vue',
            'element-ui': 'ElementUi'
          })
          config.module.rule('js').include.add('/packages/index.js').end()
        },
        configureWebpack: {
          output: {
            filename: 'index.js',
            libraryTarget: 'commonjs2',
            path: path.join(__dirname, 'dist'),
            publicPath: '/'
          }
        }
      }
