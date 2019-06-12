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
    return '-'
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
      M = (date.getMonth() + 1) + '',
      D = date.getDate() + '';
  M = M.padStart(2, 0)
  D = D.padStart(2, 0)
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
      h = date.getHours() + '',
      m = date.getMinutes() + '',
      s = date.getSeconds() + '';
  h = h.padStart(2, 0)
  m = m.padStart(2, 0)
  s = s.padStart(2, 0)
  return [h, m].join(format)
}


/**
 * @description 获取时分
 * @author lijiaxi
 * @export fn
 * @param {*} o 可转为时间对象的参数
 * @param {string} [format=':'] 时间格式连接符
 * @returns String
 */
export function getHM(o, format = ':') {
  o = o.toString().length === 13 ? o : o * 1000
  let date = new Date(o),
      h = date.getHours() + '',
      m = date.getMinutes() + '';
  h = h.padStart(2, 0)
  m = m.padStart(2, 0)
  return [h, m].join(format)
}


/**
 * @description 把时间转换成已使用的时间
 * @author lijiaxi
 * @export fn
 * @param {*} startTime number 开始时间
 * @param {*} endTime number 结束时间
 * @param {*} type 返回类型  zh | en   
 * @returns object | String
 */
export function getdTimes(startTime, endTime) {
  let val
  if (startTime > endTime) {
      return '-'
  }
  val = (endTime - startTime) / 1000;
  let d = Math.floor(val / 86400) + '';
  val = val % 86400
  let h = Math.floor(val / 3600) + ''; 
  val = val % 3600
  let m = Math.floor(val / 60) + '';
  let s = Math.floor(val % 60) + '';
  h =  h.padStart(2, 0)
  m = m.padStart(2, 0)
  s = s.padStart(2, 0)
  return {
    d, h, m, s
  }
}

export function getdTimeres(startTime, endTime, type = 'en') {
  let val
  if (startTime > endTime) {
      return '-'
  }
  val = (endTime - startTime) / 1000;
  let d = Math.floor(val / 86400) + '';
  val = val % 86400
  let h = Math.floor(val / 3600) + ''; 
  val = val % 3600
  let m = Math.floor(val / 60) + '';
  let s = Math.floor(val % 60) + '';
  let spe = ''
  if (type === 'en') {
      d = {
          k: d,
          v: `${d}天`
      }
      h = {
          k: 1,
          v: h.padStart(2, 0)
      }
      m = {
          k: 1,
          v: m.padStart(2, 0)
      }
      s = {
          k: 1,
          v: s.padStart(2, 0)
      }
      spe = ':'
  } else {
      d = {
          k: d,
          v: `${d}天`
      }
      h = {
          k: h,
          v: `${h.padStart(2, 0)}小时`
      }
      m = {
          k: m,
          v: `${m.padStart(2, 0)}分钟`
      }
      s = {
          k: s,
          v: `${s.padStart(2, 0)}秒`
      }
  }
  return [d, h, m, s].filter(item => item.k != '0').map(item => item.v).join(spe)
}
/**
 * @description 格式化url参数,小程序跳转
 * @author lijiaxi
 * @export fn
 * @param {*} [{url = '', ...other}={}] url为页面路径，other为其他参数
 * @returns String | Object
 */
export function queryStringify({url = '', ...other} = {}) {
  let res = []
  for (let key in other) {
    let value = other[key]
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    res.push(`${key}=${value}`)
  }
  res = res.join('&')
  if (url) {
    res = {
      url: `${url}?${res}`
    }
  }
  return res
}

/**
 * @description 截取url参数
 * @author lijiaxi
 * @export fn
 * @param {string} [url='']
 * @returns Object
 */
export function urlParse(url = '') {
  url = url.split('?')[1] ? url.split('?')[1] : url
  let res = {}
  let kv = url.split('&')
  for (let i = 0; i < kv.length; i++) {
    let qs = kv[i].split('=')
    res[decodeURIComponent(qs[0])] = decodeURIComponent(qs[1])
  }
  return res
}



/**
 *
 *  获取倒计时
 * @export
 * @param {*} time 时间戳
 */
export function cutDown(time) {
  // 小时
  const hour = getRD(time, 60 * 60 * 1000)
  // 分
  const minutes = getRD(hour.b, 60 * 1000)
  // 秒
  const seconds = getRD(minutes.b, 1000)
  return [hour, minutes, seconds].map(item => {
    return item.a >= 10 ? item.a : `0${item.a}`
  }).join(':')
}
function getRD(number, divisor) {
  return {
    a: Math.floor(number / divisor),
    b: number % divisor
  }
}

/**
 * @param {*} type  图片压缩后的类型
 * @param {*} img  需要压缩的图片
 * @param {*} size  图片要压缩到的尺寸
 * @param {*} cb  图片压缩成功后的回调
 */

import EXIF from 'exif-js'
export function imgRotate(e) {
  return new Promise(resolve => {
    // const _this = this
    let file = e.file,
        reader = new FileReader(),
        image = new Image(),
        img = document.createElement("img"),
        orientation = null;
    EXIF.getData(file, function () {
      orientation = EXIF.getTag(this, 'Orientation');
    });
    reader.readAsDataURL(file);
    reader.onload = function (ev) {
      image.src = ev.target.result;
      image.onload = function () {
        let _load = this,
            w = _load.width,
            h = _load.height,
            imgWidth,
            imgHeight,
            scale = (w / h).toFixed(2),
            can = document.createElement("canvas"),
            ctx = can.getContext('2d');
        //宽大
        if (scale >= 1) {
          imgWidth = w > 250 ? 250 : w
          imgHeight = Math.floor(imgWidth / scale)
        } else {
          imgHeight = h > 250 ? 250 : h
          imgWidth = Math.floor(imgHeight * scale)
        }
        can.width = imgWidth;
        can.height = imgHeight;
        //监测手机中拍出来的图片的orientation是什么数值，根据对应的数值来判断如何选择
        if (orientation && orientation !== 1) {
          switch (orientation) {
            case 6:     // 旋转90度
              can.width = imgHeight;
              can.height = imgWidth;
              ctx.rotate(Math.PI / 2);
              // (0,-imgHeight) 从旋转原理图那里获得的起始点
              ctx.drawImage(_load, 0, -imgHeight, imgWidth, imgHeight);
              break;
            case 3:     // 旋转180度
              ctx.rotate(Math.PI);
              ctx.drawImage(_load, -imgWidth, -imgHeight, imgWidth, imgHeight);
              break;
            case 8:     // 旋转-90度
              can.width = imgHeight;
              can.height = imgWidth;
              ctx.rotate(3 * Math.PI / 2);
              ctx.drawImage(_load, -imgWidth, 0, imgWidth, imgHeight);
              break;
          }
        } else {
          ctx.drawImage(_load, 0, 0, imgWidth, imgHeight,);
        }
        img.src = can.toDataURL("image/jpeg", 0.5);
        let res = dataURItoBlob(img.src)
        resolve({file: res, fileName: file.name, url: URL.createObjectURL(res)})
        // dataUri转blob函数
        function dataURItoBlob(dataURI) {
          let byteString = atob(dataURI.split(',')[1]);
          let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ab], {type: mimeString});
        }
      }
    }
  })
}

/**
 * 
 * @param {*} obj 深拷贝 
 * @returns Object
 */
function deepClone(obj) {
  return Object.entries(obj).reduce((init, [key, val]) => {
    return { ...init, [key]: typeof val === 'object' ? deepClone(val) : val}
  }, {})
}
