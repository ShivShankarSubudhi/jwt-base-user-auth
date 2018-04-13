var statusGenerator = function(message, code) {
    var toSend = new Error(message)
    toSend.statusCode = code;
    toSend.status = code;
    toSend.reason = message;
    return toSend;
};


var emailValidator = function(inputString) {
    var pattr =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattr.test(inputString);
};

var numericValidator = function(inputString) {
    var pattr = /[a-zA-Z]/;
    return !pattr.test(inputString);
};

var nullChecker = function(obj) {
    if (typeof obj == 'undefined' || obj == null)
        return true;
    else
        return false;
}



var validateUserSignup = function(user) {
    if (nullChecker(user)) {
        return statusGenerator("Please enter firstName,lastName,username,password,email and mobile number of the user to be created", 400);
    } else {
        if (nullChecker(user.firstName) || user.firstName.length == 0) {
            return statusGenerator("Please enter firstName of the user to be created", 400);
        }

        if (nullChecker(user.lastName) || user.lastName.length == 0) {
            return statusGenerator("Please enter lastName of the user to be created", 400);
        }

        if (nullChecker(user.username) || user.username.length == 0) {
            return statusGenerator("Please enter username of the user to be created", 400);
        }

        if (nullChecker(user.password) || user.password.length == 0) {
            return statusGenerator("Please enter password of the user to be created", 400);
        }

        if (nullChecker(user.email) || user.email.length == 0) {
            return statusGenerator("Please enter email of the user to be created", 400);
        }

        if (!emailValidator(user.email)) {
            return statusGenerator("Please enter a valid emailId of the user to be created", 400);
        }

        if (nullChecker(user.mobile) || user.mobile.length == 0) {
            return statusGenerator("Please enter mobile number of the user to be created", 400);
        }

        if (!numericValidator(user.mobile)) {
            return statusGenerator("Please enter a valid mobile Number of the user to be created", 400);
        }

        if (nullChecker(user.password) || user.password.length == 0) {
            return statusGenerator("Please enter password of the user to be created", 400);
        }

        return statusGenerator("All Details are Valid", 200);

    }
}



var validateUserLogin = function(user) {
    if (nullChecker(user)) {
        return statusGenerator("Please enter username and password of the user", 400);
    } else {
        if (nullChecker(user.username) || user.username.length == 0) {
            return statusGenerator("Please enter username of the user", 400);
        }

        if (nullChecker(user.password) || user.password.length == 0) {
            return statusGenerator("Please enter password of the user", 400);
        }
        return statusGenerator("All Details are Valid", 200);
    }
}

var validateUserDetails = function(username) {
    if (nullChecker(username) || username.length == 0) {
        return statusGenerator("Please enter username of the user", 400);
    }
    return statusGenerator("All Details are Valid", 200);
}


var validateForgetPassword = function(user) {
    if (nullChecker(user)) {
        return statusGenerator("Please enter email of the user", 400);
    } else {
        if (nullChecker(user.email) || user.email.length == 0) {
            return statusGenerator("Please enter email of the user", 400);
        }

        return statusGenerator("All Details are Valid", 200);

    }
}

var validateVerifyCode = function(user) {
    if (nullChecker(user)) {
        return statusGenerator("Please enter email of the user", 400);
    } else {


        if (nullChecker(user.email) || user.email.length == 0) {
            return statusGenerator("Please enter email of the user", 400);
        }
        if (nullChecker(user.token) || user.token.length == 0) {
            return statusGenerator("Please enter the unique token", 400);
        }
        return statusGenerator("All Details are Valid", 200);

    }
}

var validateChangePassword = function(user) {
    if (nullChecker(user)) {
        return statusGenerator("Please enter email of the user", 400);
    } else {


        if (nullChecker(user.email) || user.email.length == 0) {
            return statusGenerator("Please enter email of the user", 400);
        }
        if (nullChecker(user.resetPasswordToken) || user.resetPasswordToken == 0) {
            return statusGenerator("Please enter the unique resetPasswordToken", 400);
        }
        if (nullChecker(user.newPassword) || user.newPassword.length == 0) {
            return statusGenerator("Please enter the newPassword of the user", 400);
        }
        return statusGenerator("All Details are Valid", 200);

    }
}


module.exports = {};
module.exports.nullChecker = nullChecker;
module.exports.statusGenerator = statusGenerator;
module.exports.validateUserSignup = validateUserSignup;
module.exports.validateChangePassword = validateChangePassword;
module.exports.validateUserLogin = validateUserLogin;
module.exports.validateUserDetails = validateUserDetails;
module.exports.validateForgetPassword = validateForgetPassword;
module.exports.validateVerifyCode = validateVerifyCode;
