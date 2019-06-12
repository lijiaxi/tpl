import CryptoJS from './aes'

export function Int8parse (u8arr) {
    var len = u8arr.length;
    var words = [];
    for (var i = 0; i < len; i++) {
      words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
  }

export function hexToBytes (hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }


export function bytesToBase64 (bytes) {
  // Use browser-native function if it exists
  var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var base64 = [], i = 0; i < bytes.length; i += 3) {
    var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 <= bytes.length * 8)
        base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
      else base64.push("=");
    }
  }
  return base64.join("");
}
export function encryption (data, key) {//加密 data为加密数据 
  var srcsBytes = Int8parse(hexToBytes(data));//加密
  let keyBytes = Int8parse(hexToBytes(key)); 
  let encrypted = CryptoJS.AES.encrypt(srcsBytes, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  });
  return encrypted.ciphertext.toString();
}
export function decryption (data, key){//解密 data为解密数据
  var srcsBytes = bytesToBase64(hexToBytes(data));//解密
  let keyBytes = Int8parse(hexToBytes(key)); 
  let decrypted = CryptoJS.AES.decrypt(srcsBytes, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  });
  return CryptoJS.enc.Hex.stringify(decrypted).toString();
}


