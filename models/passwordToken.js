const mongoose = require('mongoose');
const databaseName = 'mongodb://127.0.0.1/userPortal';
var Schema = mongoose.Schema;

var ResetPasswordSchema = new Schema({
  token: String,
  email: String,
  authToken : String
},{
  timestamps: true,
    versionKey: false
});

var ResetPassword = mongoose.model("ResetPassword", ResetPasswordSchema);



var saveToken = function(tokenData){
  return new Promise(function(resolve, reject) {
    console.log("tokenData",tokenData);
    var resetpassword = new ResetPassword(tokenData);
    resetpassword.save(function(error){
      if (error) {
				return reject(error);
			} else {
        return resolve("Token saved Successfully");
      }
    });
	});
}

var deleteToken = function(inputData){
  return new Promise(function(resolve, reject) {
    console.log("tokenData",tokenData);
    var resetpassword = new ResetPassword(tokenData);
    resetpassword.remove({ authToken: inputData.authToken,email: inputData.email}, function(error){
      if (error) {
				return reject(error);
			} else {
        return resolve("Password Token Deleted Successfully");
      }
    });
	});
}

module.exports = {};
module.exports.saveToken = saveToken;
module.exports.deleteToken = deleteToken;
