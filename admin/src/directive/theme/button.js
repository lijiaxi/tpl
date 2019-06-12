
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    const backgroundColor = store.state.app.sidebar.backgroundColor
    el.style.cssText = `background-color: ${backgroundColor};border-color: ${backgroundColor}`
  }
}
