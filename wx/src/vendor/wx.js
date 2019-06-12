
// 扫
export function scan(options = {}) {
  return new Promise((resolve, reject) => {
    wx.scanQRCode({
      needResult: 1,
      ...options,
      success: res => resolve(res.resultStr), 
      fail: reject
    });
  })
}

export function getLocation(options = {}) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      ...options,
      success: resolve,
      fail: reject
    });
  })
}

export function openLocation(options = {}) {
  return new Promise((resolve, reject) => {
    wx.openLocation({
      ...options,
      success: resolve,
      fail: reject
    })
  })
}

export function pay(options) {

  return new Promise((resolve, reject) => {
    function onBridgeReady(){
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', options,
        res =>{
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
            resolve()
          } else {
            reject(res)
          }
      }); 
    }
    if (typeof WeixinJSBridge == "undefined"){
      if( document.addEventListener ){
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      }else if (document.attachEvent){
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    }else{
      onBridgeReady();
    }
  })
}
