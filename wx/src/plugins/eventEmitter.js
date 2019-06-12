

/**
 *  简易 EventEmitter ljx
 */
export default class EventEmitter {
  constructor () {
    this.deps = new Map()
  }
  setV (key, value) {
    this.deps.set(key, value)
  }
  getV (key) {
    return this.deps.get(key)
  }
  removeV (key) {
    this.deps.delete(key)
  }
  hasV (key) {
    return this.deps.has(key)
  }
  clearV () {
    this.deps.clear()
  }
  on (event, callback) {
    let cur = this.getV(event)
    cur = cur ? cur : []
    cur.push(callback)
    this.setV(event, cur)
    return this
  }
  off (...args) {
    let len = args.length
    if (!len) {
      this.clearV()
    } else if (len === 1) { 
      this.removeV(args[0])
    } else {
      let key = args[0]
      let value = args[1]
      let cur = this.getV(key)
      cur = cur.filter(ev => ev != value)
      this.setV(key, cur)
    }
  }
  $emit (event, ...args) {
    let cur = this.getV(event)
    if (cur) {
      cur.forEach(ev => {
        ev.apply(this, args)
      })
    }
    return this
  }
  once (event, callback) {
    let onceEv = (...args) => { 
      callback.apply(this, args)
      this.off(event, onceEv)
    }
    this.on(event, onceEv)
    return this
  }
}