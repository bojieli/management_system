var API = require('wechat').API;
var config = require('../config');
var AccessToken = require('../proxy').AccessToken;


var api = new API(config.appid, config.secret//);
	, function (callback) {
  // 传入一个获取全局token的方法

	AccessToken.getAccessToken(function(err,doc){
		if(err){
			throw err;
			return callback(null,{});
		}
		if(!doc){
			return callback(null,{});
		}
		callback(null, JSON.parse(doc.accessToken));
	});
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  AccessToken.setAccessToken(JSON.stringify(token),function(err){
  	if(err){
  		throw err;
  		return;
  	}
  	callback();
  });
});
function handleErr(err, _action){
	if(err.code === -1){
		return _action();
	}else if(err.code === 40001){
		function action_getAccessToken(){
			api.getAccessToken(function(err, token){
				if(err){
					if(err.code === -1)
						return action_getAccessToken();
					return callback(err);
				}
				return _action();
			})
		}
		action_getAccessToken();
	}
}
module.exports.sendText = function (openID, text, callback){
	function _action(){
		api.sendText(openID, text, function(err){
			if(err){
				handleErr(err, _action);
			}
			callback(null);
		});
	}
	_action();
}

module.exports.createTmpQRCode = function(sceneId, expire, callback){
	function _action(){
		api.createTmpQRCode(sceneId, expire, function(err, result){
			if(err)
				handleErr(err, _action);
			callback(null, result);
		})
	}
	_action();

}

module.exports.sendNews = function(openID, articles, callback){
	function _action(){
		api.sendNews(openID, articles, function(err){
			if(err)
				handleErr(err, _action);
			callback(null);
		})
	}
	_action();
}



module.exports.refresh = function (callback){
	api.getAccessToken(callback);
}

module.exports.showQRCodeURL = function(ticket){
	return api.showQRCodeURL(ticket);
};

// module.exports.sendNews

//module.exports = api;
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