/**
 *  PHP项目获取微信公众号js-sdk 参数jsonp方法
 *  
 * @export fn
 * @param {*} url 项目域名
 * @returns promise
 */
export default function getSign (url = document.domain) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =  `${url}/Wxsite/Wechat/callJssdk?u=${document.URL}&callback=_getSign`
    document.body.append(script)
    window._getSign = res => {
      resolve(res)
    }
  })
}
