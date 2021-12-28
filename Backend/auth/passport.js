const LocalStrategy = require("passport-local").Strategy;
const appConstant = require("../appConstants/appConstants");
const bcrypt = require("bcryptjs");
const User = require("../Modal/User");
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' },
            (username, password, done) => {
                User.findOne({ userName: username }, function(err, user) {
                    if (!user) {
                        return done(null, false, { message: appConstant.userNotFound });
                    } else {
                        bcrypt.compare(password, user.password, (err, match) => {
                            if (err) {
                                return done(err);
                            }
                            if (!match) {
                                return done(null, false, {
                                    message: appConstant.invalidPassword
                                });
                            }
                            return done(null, user);
                        });
                    }

                });

            }
        )
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        let user = await User.findById(id);
        if (user) {
            done(null, user);
        }
    });

};