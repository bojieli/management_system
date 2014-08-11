var config = {
<<<<<<< HEAD
	port : 1200,

=======
	port : 8001,
>>>>>>> 34ea17b8ff9db20abfd9bf35cbd25dc988dd1d1b
	session_secret: 'kf_519_Today',
	db : 'mongodb://localhost/519_Today_dev',
	db_name : '519_Today_dev',
	redirect_url : encodeURIComponent('http://519.today/login'),
	appid : 'wxd8c15c2734dacb07',
	secret : '188081716b20d3d655ed14328dcf7e90',
	host : 'http://kf.519.today',
    /*
  *some important errorCode
  */
  errCode_find : 50001,
  errCode_update : 50002,
  errCode_create : 50003,
  errCode_account_notfound : 50004,
  errCode_password_error : 50005
}

module.exports = config;
