const mongoose = require('mongoose');
const databaseName = 'mongodb://127.0.0.1/userPortal';
var Schema = mongoose.Schema;

var ResetPasswordSchema = new Schema({
    token: String,
    email: String,
    authToken: String
}, {
    timestamps: true,
    versionKey: false
});

var ResetPassword = mongoose.model("ResetPassword", ResetPasswordSchema);


var saveToken = function(tokenData) {
    return new Promise(function(resolve, reject) {
        console.log("tokenData", tokenData);
        var resetpassword = new ResetPassword(tokenData);
        resetpassword.save(function(error) {
            if (error) {
                return reject(error);
            } else {
                return resolve("Token saved Successfully");
            }
        });
    });
}



var findToken = function(token, email) {
    return new Promise(function(resolve, reject) {
        ResetPassword.findOne({
            token: token,
            email: email
        }, function(err, userData) {
            console.log("userData", userData);
            if (err) {
                return reject(err);
            }
            if (userData != null) {
                resolve(userData.toObject());
            } else {
                var toSendError = new Error('Token or EmailID not found');
                toSendError.status = 400;
                toSendError.reason = 'Token or EmailID not found';
                reject(toSendError);
            }
        });
    });
}

var findAuthToken = function(authToken) {
    return new Promise(function(resolve, reject) {
        console.log("authToken", authToken);
        ResetPassword.findOne({
            authToken: authToken
        }, function(err, userData) {
            console.log("userData", userData);
            if (err) {
                return reject(err);
            }
            if (userData != null) {
                resolve(userData.toObject());
            } else {
                var toSendError = new Error('Reset Password Token not found');
                toSendError.status = 400;
                toSendError.reason = 'Reset Password Token not found';
                reject(toSendError);
            }
        });
    });
}
var deleteToken = function(inputData) {
    return new Promise(function(resolve, reject) {
        console.log("inputData", inputData);
        ResetPassword.findOneAndRemove({
            authToken: inputData.authToken,
            email: inputData.email
        }, function(error) {
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
module.exports.findToken = findToken;
module.exports.findAuthToken = findAuthToken;
module.exports.deleteToken = deleteToken;
