export function scan(options = {}) {
  return new Promise((resolve, reject) => {
    ap.scan(options, res => resolve(res.code));
  })
}

export function getLocation(options = {}) {
  return new Promise((resolve, reject) => {
    ap.getLocation(options, resolve);
  })
}

export function openLocation(options = {}) {
  return new Promise((resolve, reject) => {
    ap.openLocation(options, resolve)
  })
}

export function pay(orderStr) {
  return new Promise((resolve, reject) => {
    ap.tradePay(typeof orderStr === 'object' ? orderStr : { orderStr }, resolve)
  })
}