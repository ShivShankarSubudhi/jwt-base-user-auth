const mongoose = require('mongoose');
const databaseName = 'mongodb://127.0.0.1/userPortal';
var Schema = mongoose.Schema;

var AccessTokenSchema = new Schema({
    userId: String,
    ttl: String,
    accessToken: String
}, {
    timestamps: true,
    versionKey: false
});

var AccessToken = mongoose.model("AccessToken", AccessTokenSchema);


var findToken = function(accesstoken) {
    return new Promise(function(resolve, reject) {
        AccessToken.findOne({
            accessToken: accesstoken
        }, function(err, userData) {
            if (err) {
                return reject(err);
            }
            if (userData != null) {
                resolve(userData.toObject());
            } else {
                var toSendError = new Error('AccessToken not found');
                toSendError.status = 400;
                toSendError.reason = 'AccessToken not found';
                reject(toSendError);
            }
        });
    });
}


var saveToken = function(tokenData) {
    return new Promise(function(resolve, reject) {
        console.log("tokenData", tokenData);
        var accesstoken = new AccessToken(tokenData);
        accesstoken.save(function(error) {
            if (error) {
                return reject(error);
            } else {
                return resolve("Token saved Successfully");
            }
        });
    });
}


var deleteToken = function(inputData) {
    return new Promise(function(resolve, reject) {
        console.log("inputData", inputData);
        AccessToken.findOneAndRemove({
            accessToken: inputData.accesstoken
        }, function(error) {
            if (error) {
                return reject(error);
            } else {
                return resolve("Access Token Deleted Successfully");
            }
        });
    });
}

module.exports = {};
module.exports.findToken = findToken;
module.exports.saveToken = saveToken;
module.exports.deleteToken = deleteToken;
