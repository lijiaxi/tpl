import theme from './button'

const install = function(Vue) {
  Vue.directive('permission', theme)
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install); // eslint-disable-line
}

theme.install = install
export default theme
