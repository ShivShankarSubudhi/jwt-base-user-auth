const userModel = require('../models/user.js');
const config = require('./config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenExpiry = 864000;
const loginTokenModule = require('../models/loginToken.js');

var generateToken = function(username) {
    var token = jwt.sign({
        id: username
    }, config.secretKey, {
        expiresIn: tokenExpiry
    });
    return token;
}

var validatePassword = function(loginPassword, passwordHash) {
    if (bcrypt.compareSync(loginPassword, passwordHash)) {
        return true;
    } else {
        return false;
    }
}



var checkLogin = function(loginInput) {
    return new Promise(function(resolve, reject) {
        userModel.findUsername(loginInput.username).then(function(dbObj) {
            console.log("dbObj", dbObj);
            if (validatePassword(loginInput.password, dbObj.password)) {
                var loginOutput = {
                    userId: dbObj["_id"].toString(),
                    ttl: tokenExpiry,
                    accessToken: generateToken(dbObj["username"])
                }
                loginTokenModule.saveToken(loginOutput).then(function(dbObj) {
                    console.log("loginOutput", loginOutput);
                    resolve(loginOutput);
                }).catch(function(err) {
                    console.log("err", err);
                    var toSendError = new Error('Error in Saving');
                    toSendError.status = 400;
                    toSendError.reason = 'Error in Saving';
                    reject(toSendError);
                })
            } else {
                var toSendError = new Error('Login Failed. Username and Password doesnot match');
                toSendError.status = 401;
                toSendError.reason = 'Login Failed. Username and Password doesnot match';
                reject(toSendError);
            }
        }).catch(function(err) {
            console.log("err", err);
            var toSendError = new Error('User not found');
            toSendError.status = 400;
            toSendError.reason = 'User not found';
            reject(toSendError);
        })
    });
}

module.exports = {};
module.exports.checkLogin = checkLogin;
