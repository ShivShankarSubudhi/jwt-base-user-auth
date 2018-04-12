const config = require('./config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenExpiry = 864000;
const rn = require('random-number');
const emailModule = require('./email.js');
const options = {min:  100000, max:  999999, integer: true};
const passwordTokenModule = require('../models/passwordToken.js');
var generateToken = function(tokenId){
  var token = jwt.sign({ id: tokenId}, config.secretKey, {
    expiresIn: tokenExpiry
  });
  return token;
}


var createToken = function(email,user){
  return new Promise(function(resolve, reject) {
    var randNumber = rn(options)
    var resetPassword = {
      token: randNumber,
      email: email,
      authToken : generateToken(email+ "~~~" + randNumber)
    };
    passwordTokenModule.saveToken(resetPassword).then(function(response) {
      emailModule.sendEmail(user,resetPassword.token).then(function(emailResponse) {
        console.log("emailResponse",emailResponse);
        resolve(resetPassword);
      })
      .catch(function(err) {
        reject(err);
      })
    }).catch(function(err) {
      reject(err);
    })
  });
}



module.exports = {};
module.exports.createToken = createToken;
