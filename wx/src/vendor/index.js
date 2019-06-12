/**
 *  对微信公众号和支付宝生活调起扫一扫、定位等做适配
 */

const defaultConfig = require('../setting');
const { BASE_PATH: platform } = defaultConfig;
import * as utilsWx from './wx';
import * as utilsAli from './ali';

const UTILS = platform === 'wx' ? utilsWx : utilsAli

export default UTILS

