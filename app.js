const express = require('express');
const http = require('http');
const path = require('path');
const userModel = require('./models/user.js');
const loginModel = require('./models/loginToken.js');
const utils = require('./modules/utils');
const loginModule = require('./modules/login.js');
const authModule = require('./modules/authVerify.js');
const emailModule = require('./modules/email.js');
const passwordResetModule = require('./modules/passwordReset.js');
var app = module.exports = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
};


/**
 * Routes
 */

app.use(function(req, res, next) {
    res.render('404', {
        status: 404,
        url: req.url
    });
});
app.use(function(err, req, res, next) {
    res.render('404', {
        status: 500,
        error: err
    });
});


app.post('/user/signup', function(req, res) {
    if(utils.validateUserSignup(req.body).statusCode == 200){
      userModel.findUser(req.body).then(function(response) {
        userModel.saveUser(req.body).then(function(response) {
          var obj = {
            msg : response
          };
          res.status(200);
          res.json(obj);
        }).catch(function(err) {
          res.status(500);
          res.json(err);
        })

      }).catch(function(err) {
        res.status(err.status);
        res.json(err);
      })
    } else {
      var errorResponse = utils.validateUserSignup(req.body);
      res.status(errorResponse.statusCode);
      res.json(errorResponse);
    }
});


app.post('/user/login', function(req, res) {
  if(utils.validateUserLogin(req.body).statusCode == 200){
    loginModule.checkLogin(req.body).then(function(loginResponse) {
      res.status(200);
      res.json(loginResponse);
    }).catch(function(err) {
      res.status(err.status);
      res.json(err);
    })
  } else {
    var errorResponse = utils.validateUserLogin(req.body);
    res.status(errorResponse.statusCode);
    res.json(errorResponse);
  }

});


app.get('/user/details', function(req, res) {
  console.log("req",req.query);
    if(utils.nullChecker(req.query) || utils.nullChecker(req.query.username) || req.query.username.length == 0){
      var errorResponse = {
          "message" :"Please pass the username in of the user for which details has to given",
          "status" :400
       }
       res.status(400);
       res.json(errorResponse);
    }  else {
      authModule.validateHeader(req,req.query.username).then(function(headerResponse) {
          userModel.findUsername(req.query.username).then(function(userData) {
            console.log("userData",userData);
            userData.userId = userData["_id"];
            delete userData.password;
            delete userData["_id"];
            res.status(200);
            res.json(userData);
          }).catch(function(err) {
            res.status(err.status);
            res.json(err);
          })
        }).catch(function(err) {
          res.status(err.status);
          res.json(err);
        })
    }
});



app.post('/user/forgotPassword', function(req, res) {
  if(utils.validateForgetPassword(req.body).statusCode == 200){
    userModel.findUseremail(req.body.email).then(function(userData) {
      console.log("userData",userData);
      passwordResetModule.createToken(req.body.email,userData).then(function(passwordResetData) {
        res.status(200);
        delete passwordResetData.email;
        delete passwordResetData.token;
        var obj = {
          msg : "Email sent Successfully"
        };
        res.status(200);
        res.json(obj);
      }).catch(function(err) {
        res.status(err.status);
        res.json(err);
      })
    }).catch(function(err) {
      res.status(err.status);
      res.json(err);
    })
  } else {
    var errorResponse = utils.validateForgetPassword(req.body);
    res.status(errorResponse.statusCode);
    res.json(errorResponse);
  }
});


app.get('/user/signout', function(req, res) {
    if(utils.nullChecker(req.query) || utils.nullChecker(req.query.accesstoken) || req.query.accesstoken.length == 0){
      var errorResponse = {
          "message" :"Please pass the accesstoken in of the user for which details has to given",
          "status" :400
       }
       res.status(400);
       res.json(errorResponse);
    } else {
      loginModel.findToken(req.query.accesstoken).then(function(passwordResponse) {
        loginModel.deleteToken(req.query).then(function(passwordResponse) {
            var obj = {
              msg : passwordResponse
            };
            res.status(200);
            res.json(obj);
          }).catch(function(err) {
            console.log("err",err);
            res.status(err.status);
            res.json(err);
          })
        }).catch(function(err) {
          console.log("err",err);
          res.status(err.status);
          res.json(err);
        })

    }
});



/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
