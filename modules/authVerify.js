const config = require('./config');
const jwt = require('jsonwebtoken');
const utils = require('./utils.js');
const loginModel = require('../models/loginToken.js');

var getTokenDetails = function(accessToken) {
    return new Promise(function(resolve, reject) {
        jwt.verify(accessToken, config.secretKey, function(err, decoded) {
            console.log("err", err);
            if (err) {
                var toSendError = new Error('Invalid Access Token');
                toSendError.status = 400;
                toSendError.reason = 'Invalid Access Token';
                reject(toSendError);
            } else {
                resolve(decoded);
            }
        });
    });
}

var validateHeader = function(req, username) {
    return new Promise(function(resolve, reject) {
        if (utils.nullChecker(req.headers) || utils.nullChecker(req.headers.authorization) || req.headers.authorization.length == 0) {
            reject(utils.statusGenerator("Authorization Failed", 401));
            return;
        }
        loginModel.findToken(req.headers.authorization).then(function(passwordResponse) {
            getTokenDetails(req.headers.authorization).then(function(jwtResponse) {
                console.log("jwtResponse", jwtResponse);
                var timestamp = parseInt((new Date().getTime()) / 1000);
                console.log("timestamp", timestamp);
                console.log("username", username);
                if (jwtResponse.id == username && timestamp > jwtResponse.iat && timestamp < jwtResponse.exp) {
                    var obj = {
                        "message": "Header is valid"
                    }
                    resolve(obj);
                } else {
                    reject(utils.statusGenerator("Authorization Failed", 401));
                    return;
                }
            }).catch(function(err) {
                console.log("err", err);
                reject(utils.statusGenerator("Authorization Failed", 401));
                return;
            })
        }).catch(function(err) {
            console.log("err", err);
            reject(utils.statusGenerator("Authorization Failed", 401));
            return;
        })
    });
}


module.exports = {};
module.exports.validateHeader = validateHeader;
