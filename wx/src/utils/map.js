/**
 *  根据经纬度计算两点之间的距离
 * @export
 * @param {*} startPoint 
 * @param {*} endPoint
 * @returns
 */
export function calculateLineDistance(startPoint, endPoint) {
  var d1 = 0.01745329251994329;
  var d2 = startPoint.lng || startPoint.longitude
  var d3 = startPoint.lat || startPoint.latitude
  var d4 = Number(endPoint.lng) || endPoint.longitude
  var d5 = Number(endPoint.lat) || endPoint.latitude  
  d2 *= d1;
  d3 *= d1;
  d4 *= d1;
  d5 *= d1;
  var d6 = Math.sin(d2);
  var d7 = Math.sin(d3);
  var d8 = Math.cos(d2);
  var d9 = Math.cos(d3);
  var d10 = Math.sin(d4);
  var d11 = Math.sin(d5);
  var d12 = Math.cos(d4);
  var d13 = Math.cos(d5);
  var arrayOfDouble1 = [];
  var arrayOfDouble2 = [];
  arrayOfDouble1.push(d9 * d8);
  arrayOfDouble1.push(d9 * d6);
  arrayOfDouble1.push(d7);
  arrayOfDouble2.push(d13 * d12);
  arrayOfDouble2.push(d13 * d10);
  arrayOfDouble2.push(d11);
  var d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
      (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
      (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
  return Math.floor((Math.asin(d14 / 2.0) * 12742001.579854401))
}

// 高德定位 ios 10以上由於webkit瀏覽器升級 http协议域名無法在4g環境下使用
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    let map, geolocation, plugin
    plugin = ['AMap.Geolocation', 'AMap.ToolBar']
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11,
    });
    map.plugin(plugin, function () {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //  是否使用高精度定位，默认:true
        timeout: 10000, //  超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //  显示定位按钮，默认：true
        buttonPosition: 'LT', // 定位按钮停靠位置，默认：'LT'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: false, //  定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //  定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });    
      map.addControl(geolocation);
      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      map.addControl(new AMap.ToolBar());
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
      AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    });
    //解析定位结果
    function onComplete(result) {
      resolve({
        map,
        result
      })
    }

    function onError(err) {
      reject(err)
    }
  })

}
/**
 * 高德地图 路线规划
 *
 * @export
 * @param {*} startLngLat
 * @param {*} endLngLat
 * @returns
 */
export function nav (startLngLat, endLngLat) {
  return new Promise((resolve, reject) => {
    let map, steps, plugin;
    if (env == 'development') {
      plugin = ['AMap.Driving', 'AMap.ToolBar']
    } else {
      plugin = ['AMap.Driving']
    }
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 15,
    });
    map.plugin(plugin, function () {
        let driving = new AMap.Driving({
      // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
        policy: AMap.DrivingPolicy.LEAST_TIME
      })
      if (env === 'development') {
        map.addControl(new AMap.ToolBar());
      }
      AMap.event.addListener(driving, "complete", drivingDrawLine);
      driving.search(startLngLat, endLngLat)
      function drivingDrawLine(result) {
        steps = result.routes[0].steps
        //起点、终点图标
        let sicon = new AMap.Icon({
            image: "http://webapi.amap.com/theme/v1.3/markers/n/start.png",
            size: new AMap.Size(18, 30),
            imageSize: new AMap.Size(18, 30),
          });
          let eicon = new AMap.Icon({
            image: "http://webapi.amap.com/theme/v1.3/markers/n/end.png",
            size: new AMap.Size(18, 30),
            imageSize: new AMap.Size(18, 30),
          });
        // 起点
        let startmarker = new AMap.Marker({
          icon: sicon, //复杂图标
          visible: true,
          position: startLngLat,
          offset: new AMap.Pixel(-9, -30),
          animation: 'AMAP_ANIMATION_DROP',
          map: map
        });
        map.add(startmarker);
        // 终点
        let endmarker = new AMap.Marker({
          animation: 'AMAP_ANIMATION_BOUNCE',
          icon: eicon, //复杂图标
          visible: true,
          position: endLngLat,
          map: map,
          offset: new AMap.Pixel(-9, -30),
        });
        map.add(endmarker);
        //起点到路线的起点 路线的终点到终点 绘制无道路部分
        let extra_path1 = new Array();
        extra_path1.push(startLngLat);
        extra_path1.push(steps[0].path[0]);
        let extra_line1 = new AMap.Polyline({
          map: map,
          path: extra_path1,
          strokeColor: "#9400D3",
          strokeOpacity: 0.7,
          strokeWeight: 4,
          strokeStyle: "dashed", //虚线
          strokeDasharray: [10, 5]
        });

        let extra_path2 = new Array();
        let path_xy = steps[(steps.length - 1)].path;
        extra_path2.push(endLngLat);
        extra_path2.push(path_xy[(path_xy.length - 1)]);
        let extra_line2 = new AMap.Polyline({
          map: map,
          path: extra_path2,
          strokeColor: "#9400D3",
          strokeOpacity: 0.7,
          strokeWeight: 4,
          strokeStyle: "dashed", //虚线
          strokeDasharray: [10, 5]
        });
        let drawpath = new Array();
        for (let s = 0; s < steps.length; s++) {
          drawpath = steps[s].path;
          let polyline = new AMap.Polyline({
            map: map,
            path: drawpath,
            strokeColor: "#9400D3",
            strokeOpacity: 0.7,
            strokeWeight: 4,
            strokeDasharray: [10, 5]
          });
        }
        map.setFitView();
      }
    });

  })
}

