import DftSetting from '@/settings';

export const APP_UNIQUE_NAME = 'jmbm';   // 取项目按照项目的中文拼音或者英文。保证每个项目唯一

export const REQUEST_URL = 'http://www.ljieb.cn/api/';

export const REQUEST_TIMEOUT = 100000;

export const VUE_PROTO_ATTR = {
  imgUrl: 'http://www.ljieb.cn/',
  $uploadUrl: 'http://www.ljieb.cn/api/file/front/upload'
};

export const AUTH_KEY = `dlc-authorization`;

export const AUTH_EXPIRES = 3;

export const DEFAULT_TITLE = `${DftSetting.title}后台管理系统`

