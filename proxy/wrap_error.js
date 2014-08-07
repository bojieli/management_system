exports.wrapError = function(preError,errCode,errMethod,errFilename,errObject){
  preError.errCode = errCode;
  preError.errMethod = errMethod;
  preError.errFilename = errFilename;
  preError.errObject = errObject||{};
}