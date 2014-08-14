var API = require('wechat').API;
var db = require('./db');
var config = require('../config');
var appkey = config.appid;
var secret = config.secret;

var fs = require('fs');
var dir = process.cwd();
var api = new API(appkey, secret//);
	, function (callback) {
  // 传入一个获取全局token的方法
	db.getConfig(function(err,doc){
		if(err){
			return callback(err);
		}
		if(!doc){
			return callback(null,{});
		}
		console.log(doc.access_token);
		callback(null,JSON.parse(doc.access_token));
	});
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  db.setConfig({access_token:JSON.stringify(token)},callback);

});

module.exports = api;
// =======send text=======
// api.sendText('openid', 'Hello world', callback);

// =======send image======
// api.sendImage('openid', 'media_id', callback);

// =======send voice======
// api.sendVoice('openid', 'media_id', callback);

// =======send video======
// api.sendVideo('openid', 'media_id', 'thumb_media_id', callback);

// =======send music======
// var music = {
//  title: '音乐标题', // 可选
//  description: '描述内容', // 可选
//  musicurl: 'http://url.cn/xxx', 音乐文件地址
//  hqmusicurl: "HQ_MUSIC_URL",
//  thumb_media_id: "THUMB_MEDIA_ID"
// };
// api.sendMusic('openid', music, callback);

//========send news=======
// var articles = [
//  {
//    "title":"Happy Day",
//    "description":"Is Really A Happy Day",
//    "url":"URL",
//    "picurl":"PIC_URL"
//  },
//  {
//    "title":"Happy Day",
//    "description":"Is Really A Happy Day",
//    "url":"URL",
//    "picurl":"PIC_URL"
//  }];
// api.sendNews('openid', articles, callback);