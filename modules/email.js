 const config = require('./config');
const mailjet = require ('node-mailjet')
	.connect(config["MJ_APIKEY_PUBLIC"],config["MJ_APIKEY_PRIVATE"])

var sendEmail = function(userData,token){
		console.log("userData",userData);
		console.log("token",token);
	    return new Promise(function(resolve, reject) {
	      const request = mailjet
	      .post("send", {'version': 'v3.1'})
	      .request({
	        "Messages":[
	          {
	            "From": {
	              "Email": "kcgokul1995@gmail.com",
	              "Name": "Gokul Kandasamy User Portal"
	            },
	            "To": [
	              {
	                "Email": userData.email,
	                "Name": userData.firstName
	              }
	            ],
	            "Subject": "User Portal Forgot Password",
	            "TextPart": "",
	            "HTMLPart": "Dear " + userData.firstName + "<br/>Please use the following token to reset your password.<br/> Your Verification Token: <b>" + token + "</b>"
	          }
	        ]
	      })


	      request.then(function(response) {
					var obj = {
						msg : "Email Sent Successfully"
					};
	        resolve(obj);
	      }).catch(function(err) {
					var toSendError = new Error('Error is Sending Email');
					toSendError.status = 400;
					toSendError.reason = 'Error is Sending Email';
					reject(toSendError);
	      })
	    });
	}

	module.exports = {};
	module.exports.sendEmail = sendEmail;
