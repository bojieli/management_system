var config = {
  port :6088,
  session_secret: '519_Today',
  db : 'mongodb://localhost/519_Today_dev',
  db_name : '519_Today_dev',
  host : 'http://519.today',

  /*
  *some important errorCode
  */
  errCode_find : 50001,
  errorCode_update : 50002,
  errorCode_create : 50003,
  errorCode_account_notfound : 50004,
  errorCode_password_error : 50005
}

module.exports = config;