const mongoose = require('mongoose');
const databaseName = 'mongodb://127.0.0.1/userPortal';
const bcrypt = require('bcrypt');
const saltRounds = 10;
mongoose.connect(databaseName, function (err) {
  return new Promise(function(resolve, reject) {

    if (err){
      var toSendError = new Error('Unable to Mongodb');
      toSendError.status = 500;
      toSendError.reason = 'Unable to Mongodb';
      reject(body.error);
    } else {

      console.log('Successfully connected to Mongodb');
    }


  });

});

 var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  mobile: String,
  password: String,
  active :Boolean
},{
  timestamps: true,
    versionKey: false
});


 var User = mongoose.model("User", UserSchema);

var findUsername = function(username) {
	return new Promise(function(resolve, reject) {
		User.findOne({
			username: username
		}, function(err, userData) {
			if (err) {
				return reject(err);
			}
			if (userData != null) {
				resolve(userData.toObject());
			} else {
        var toSendError = new Error('User not found');
        toSendError.status = 400;
        toSendError.reason = 'User not found';
        reject(toSendError);
			}
		});
	});
}


var findUseremail = function(email) {
	return new Promise(function(resolve, reject) {
    console.log("email",email);
		User.findOne({
			email: email
		}, function(err, userData) {
			if (err) {
				return reject(err);
			}
			if (userData != null) {
				resolve(userData.toObject());
			} else {
        var toSendError = new Error('User not found');
        toSendError.status = 400;
        toSendError.reason = 'User not found';
        reject(toSendError);
			}
		});
	});
}

var saveUser = function(userData){
  return new Promise(function(resolve, reject) {
    userData.active = true;
    userData.password =  bcrypt.hashSync(userData.password, saltRounds);
    console.log("userData",userData);
    var user = new User(userData);
    user.save(function(error){
      if (error) {
				return reject(error);
			} else {
        resolve("User Saved Successfully");
      }
    });
	});
}

var findUser = function(data) {
	return new Promise(function(resolve, reject) {
	     findUsername(data.username).then(function(response) {
         var toSendError = new Error('User exists with the same username');
         toSendError.status = 400;
         toSendError.reason = 'User exists with the same username';
         reject(toSendError);
       }).catch(function(err) {
         findUseremail(data.email).then(function(response) {
           var toSendError = new Error('User exists with the same email');
           toSendError.status = 400;
           toSendError.reason = 'User exists with the same email';
           reject(toSendError);
         }).catch(function(err) {
           var obj = {
             status : 200,
             message : "User not found"
           }
           resolve(obj);
         })
       })
	});
}


module.exports = {};
module.exports.findUsername = findUsername;
module.exports.findUseremail = findUseremail;
module.exports.findUser = findUser;
module.exports.saveUser = saveUser;
