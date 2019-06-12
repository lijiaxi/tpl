const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
  ** middleware of the page
  */
  // router: {
  //   middleware: 'userAgent'
  // },
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { name: 'baidu-site-verification', content: "BnRRXKs6Ya" },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: '深圳迪尔西科技,深圳市维码物联网有限公司,移动移动互联网APP开发,智慧社区APP开发,物联网软硬件方案解决,共享垃圾回收站开发,共享陪护床APP开发,共享新零售APP开发,共享新风机APP开发,共享无人售货机APP开发,共享陪护床APP开发,共享纸巾机APP开发,共享充电宝APP开发,共享按摩椅APP开发,深圳软件定制APP开发'},
      { hid: 'description', name: 'description', content: '深圳迪尔西科技,深圳市维码物联网有限公司,深圳迪尔西科技专注于移动互联网APP开发，智慧社区APP开发，物联网软硬件一体化方案解决，高端正规，价格透明公道，全五星好评，客户满意度100%,300位优秀工程师开发团队,拥有7年开发经验,超过720个行业见证！' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
    script: [
      { src: '/js/amfe-flexible.js', type: 'text/javascript', charset: 'utf-8'},
      { src: '/js/bs.js', type: 'text/javascript', charset: 'utf-8'}
    ],

  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fb5707' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    'animate.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',  
    '@/plugins/ga',
    { src: '@/plugins/vuePlyr', ssr: false }, // 首页 video 插件
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'https://m.nbdlc.com/api',
    browserBaseURL: 'https://m.nbdlc.com/api',
    proxy: true
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    postcss: [
      require('postcss-px2rem')({
        remUnit: 37.5
      })
    ],
    extend(config, ctx) {
     
    }
  }
}
