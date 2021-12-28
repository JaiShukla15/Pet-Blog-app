const mongoose = require("mongoose");
const appConstants = require("../appConstants/appConstants");
const logjs = require("log4js");
module.exports = {
    isAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    },
    sendWelcomeMail: function(firstName, verificationCode) {
        return `<div align='center'> <h1>Hi ${firstName} !</h1> \n <h3><b>Congratulations you are successfully registered \n please Login to Verify Your Account , Your verification Code is ${verificationCode} \n <a href='http://localhost:4200/login'>click here to Login<a></b><h3></div>`;
    },
    forgotPasswordMail: function(firstName) {
        return `<div align='center'> <h2>Hi ${firstName} !</h2> \n <h5><b> 
    You just Requested to change the password \n Please click below link to change the password</b>
    </h5>
    <h5><a href='http://localhost:4200/forgotPasswordCheck/'>please click here to change your password</a></div>`;
    },
    InviteMail: function(firstName) {
        return `<div align='center'> <h2>Hi ${firstName} !</h2> \n <h5><b> 
    Please Join With Us  \n Please click below link to Join</b>
    </h5>
    <h5><a href='http://localhost:4200/register'>please click here to Register</a></div>`;
    },
    connectDb(mongoUrl) {
        mongoose
            .connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true })
            .then(db => {
                if (db) {
                    console.log(appConstants.dbConnected);
                }
            })
            .catch(er => {
                console.log(appConstants.errorMsg);
            });
    },
    getLogger: () => logjs.getLogger()
};