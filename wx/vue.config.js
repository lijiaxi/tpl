const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

const defaultConfig = require('./src/setting')
const { APP_NAME: name, BASE_PATH } = defaultConfig
// node文件路径解析方法  __dirname 文件路劲
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = {
  publicPath: `${BASE_PATH}`,
  outputDir:  `${BASE_PATH}`,
  lintOnSave: false,
  css: {
    // modules: true,
    loaderOptions: {
      stylus: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件, 其他styl文件自动@import 该文件
        // data: `@import "@/stylus/variables.styl"`
      },
      // px 转 rem  开发设计稿按照750  然后给ps量的宽度除以 2  插件自己转
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
            selectorBlackList: [] // 'van-'
          })
        ]
      }
    }
  },
  devServer: {
    // eslint
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8888, // 端口号
    host: '0.0.0.0',
    https: false,
    open: true, //配置自动启动浏览器
    // proxy: 'http://localhost:4000'
    proxy: {
      '/api': {
        //target: 'http://192.168.1.118:9148',
        //target: 'http://192.168.1.61:9148',
        // target: 'http://192.168.1.61:9146',
        target: 'https://renzongsharebed.dlc-sz.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    },
  },
  // 处理图标
  chainWebpack: config => {
    // 第三方cd
    const sdkPlatform = BASE_PATH === 'wx' ? 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js' : 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.inc.min.js'
    const cdn = {
      js: [sdkPlatform]
    }
    config.plugin('html')
      .tap(args => {
        args[0].cdn = cdn
        return args
      })
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  configureWebpack: config => {
    let isClear = process.env.npm_config_clear
    if (process.env.NODE_ENV === 'production') {
      return {
        name,
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                compress: {
                  warnings: isClear,
                  drop_console: isClear, //console
                  drop_debugger: isClear // pure_funcs: ['console.log']移除
                }
              }
            })
          ]
        },
        // plugins: [
        //   new PrerenderSPAPlugin({
        //     // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
        //     staticDir: path.join(__dirname, `${BASE_PATH}`),
        //     outputDir: path.join(__dirname, `${BASE_PATH}/${BASE_PATH}`),
        //     indexPath: path.join(__dirname, `${BASE_PATH}`, `/${BASE_PATH}/index.html`),
        //     // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
        //     routes: ['/home/index', '/mall/hospital', '/mall/index'],
        //     // 这个很重要，如果没有配置这段，也不会进行预编译
        //   }),
        // ],
      }
    } else {
      return {
        name
      }
    }

  }
}
