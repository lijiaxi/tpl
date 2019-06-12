/**
 *   判断是否是微信浏览器
 *
 * @export fn
 * @returns boolean
 */
export function is_weixin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
  } else {
      return false;
　   }
}
/**
 *   判断手机系统类型
 *
 * @export fn
 * @returns Number 1 为安卓 0为ios
 */
export function systemType () {
  var u = navigator.userAgent, app = navigator.appVersion;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isAndroid ? 1 : 0
}
