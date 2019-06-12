
/**
 * @description 时间戳获取年月日时分秒
 * @author lijiaxi
 * @export fn
 * @param {*} time 可转为时间对象的参数
 * @param {*} [format='-'] 时间格式连接符
 * @returns String
 */
export function parseTime(time, format = '-,:') {
  if (!time) {
    return 0
  } 
  time = time.toString().length === 13 ? time : time * 1000
  let sep = format.split(',')
  return `${getYMD(time, sep[0])} ${getHMS(time, sep[1])}`
}
/**
* @description 时间戳获取年月日
* @author lijiaxi
* @export fn
* @param {*} o 可转为时间对象的参数
* @param {string} [format='-'] 时间格式连接符
* @returns String
*/
export function getYMD(o, format = '-') {
o = o.toString().length === 13 ? o : o * 1000
let date = new Date(o),
Y = date.getFullYear(),
M = date.getMonth() + 1 ,
D = date.getDate() + ' ';
M = M < 10 ? '0' + M : M
D = D < 10 ? '0' + D : D
return [Y, M, D].join(format)
}
/**
* @description 获取时分秒
* @author lijiaxi
* @export fn
* @param {*} o 可转为时间对象的参数
* @param {string} [format=':'] 时间格式连接符
* @returns String
*/
export function getHMS(o, format = ':') {
o = o.toString().length === 13 ? o : o * 1000
let date = new Date(o),
h = date.getHours(),
m = date.getMinutes(),
s = date.getSeconds();
h = h < 10 ? '0' + h : h
m = m < 10 ? '0' + m : m
s = s < 10 ? '0' + s : s
return [h, m, s].join(format)
}

/**
* @description 把时间转换成已使用的时间
* @author lijiaxi
* @export fn
* @param {*} startTime 开始时间
* @param {*} endTime 结束时间
* @returns object | String
*/
export function getdTimes (startTime, endTime) {
if (startTime > endTime) {
  return '1分钟'
}
let argsLen = arguments.length
if (argsLen == 2) {
  var val = (endTime - startTime) / 1000;
} else {
  var val = startTime / 1000;
}
let d = Math.floor(val / 86400);
    d = "" + d
    val = val % 86400
let h = Math.floor( val / 3600); 
    h = h < 10 ? '0' + h : '' + h
    val = val % 3600
let m = Math.floor(val / 60);
    m = m < 10 ? '0' + m : '' + m
let s = Math.floor(val % 60);
    s = s < 10 ? '0' + s : '' + s
return { d, h, m, s }
}

export function getdTime (startTime, endTime) {
if (startTime > endTime) {
  return '1分钟'
}
let argsLen = arguments.length
if (argsLen == 2) {
  var val = (endTime - startTime) / 1000;
} else {
  var val = startTime / 1000;
}
let d = Math.floor(val / 86400);
    val = val % 86400
let h = Math.floor( val / 3600); 
    val = val % 3600
let m = Math.floor(val / 60);
let s = Math.floor(val % 60);
d = {
  k: d,
  v: d + '天'
}
h = {
  k: h,
  v: h + '小时'
}
m = {
  k: m,
  v: m + '分钟'
}
s = {
  k: s,
  v: s + '秒'
}
return [d, h, m, s].filter(item => item.k).map(item => item.v).join('')
}

/**
* @description 格式化url参数,小程序跳转
* @author lijiaxi
* @export fn
* @param {*} [{url = '', ...other}={}] url为页面路径，other为其他参数
* @returns String | Object
*/
export function queryStringify ({url = '', ...other} = {}) {
let res = []
for (let key in other) {
  let value = typeof value === 'object' ? 
      JSON.stringify(other[key]) : 
      other[key]
  res.push(`${key}=${value}`)
}
res = res.join('&')
res = url ? 
`${url}?${res}` : 
  res
return res
}
/**
* @description 截取url参数
* @author lijiaxi
* @export fn
* @param {string} [url='']
* @returns Object
*/
export function urlParse (url = '') {
url = url.split('?')[1] ? url.split('?')[1] : url
let res = {}
let kv = url.split('&')
for (let i = 0;i < kv.length; i++) {
  let qs = kv[i].split('=')
  res[decodeURIComponent(qs[0])] = decodeURIComponent(qs[1])
}
return res
}
