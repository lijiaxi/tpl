

export function getStorage(key) {
  let storage = window.localStorage.getItem(key)
  if (storage) {
    try {
      storage = JSON.parse(storage)
      let expires = storage[expires]
      if (expires) {
        let now = new Date().getTime()
        expires = parseInt(expires, 10)
        if (now - expires > 0) {
          removeToken(key)
          return ''
        }
      }
      return storage.value
    } catch (error) {
      return storage
    }
  }
  return ''
}

// 保存token到本地缓存
export function setStorage(
  {
    key = '',
    expires = '',
    value = ''
  } = {},
) {
  if (!key.trim()) {
    throw SyntaxError('set storage must have a key')
    return
  }
  if (expires) {
    expires = expires * 1000 * 60 * 60 * 24
    window.localStorage.setItem(key, JSON.stringify({
      expires,
      value
    }))
  } else {
    window.localStorage.setItem(key, JSON.stringify({
      value
    }))
  }
}

// 清楚本地token
export function removeStorage(key) {
  window.localStorage.removeItem(key)
}