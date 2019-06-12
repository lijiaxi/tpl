
const defaultConfig = require('../setting')

const { APP_NAME: appName, BASE_PATH: basePath } = defaultConfig

const DOMAIN = 'renzongsharebed.dlc-sz.com'

const PROTOCOL = window.location.protocol

const WS_PROTOCOL = PROTOCOL === 'http' ? 'ws' : 'wss'

// 请求域名
export const REQUEST_URL = `${PROTOCOL}//${DOMAIN}`
// 授权路劲
export const QUAH_RIDERECT_URL = `${PROTOCOL}//${DOMAIN}/openPlatFormAuth?type=${basePath == 'wx' ? 1 : 2}&`

// 请求超时时间
export const REQUEST_TIMEOUT = process.env.NODE_ENV === 'development' ? 10000 : 5000

// websocket url
export const WEBSOCKET_URL = `${WS_PROTOCOL}://${DOMAIN}`

// 本地token名称，根据项目名称更改
export const AUTH_KEY = 'authorization-app'

// token 过期时间
export const EXPIRES = 2

// 项目首页title
export const APP_NAME = appName

// 项目相对服务器根路径的path
export const BASE_PATH = basePath

