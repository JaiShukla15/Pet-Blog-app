const passport = require("passport");
const appConstants = require("../appConstants/appConstants");
const jwt = require("jsonwebtoken");
const hashed = require("bcryptjs");
const config = require("../config/config");
const mail = require("nodemailer");
const {
    sendWelcomeMail,
    forgotPasswordMail,
    getLogger,
    InviteMail
} = require("../utility/utility");
const User = require("../Modal/User");
const logger = getLogger();
module.exports = {
    register: (req, res) => {
        User.find({ email: req.body.email }).then(user => {
            if (user.length > 0) {
                logger.info({ message: appConstants.userExists });
                return res.json({
                    message: appConstants.userExists,
                    data: null,
                    success: false
                });
            } else {
                let verificatonCode =
                    Math.floor(Math.random() * (999999 - 100000 + 1)) + 10000;
                req.files.profilePic.mv(
                    "../images/users/" + req.body.email + ".jpg",
                    function (err) {
                        if (err) {
                            logger.error({ message: err });
                        } else {
                            logger.info({ message: appConstants.userSavedSuccessfully });
                        }
                    }
                );
                hashed.genSalt(10, (err, salt) => {
                    if (err) {
                        logger.error({ message: err });
                    } else {
                        hashed.hash(req.body.password, salt, (err, hash) => {
                            if (hash) {
                                let newUser = new User({
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    userName: req.body.userName,
                                    email: req.body.email,
                                    verificationCode: verificatonCode,
                                    password: hash,
                                    profilePic: "../images/users/" + req.body.email + ".jpg",
                                    security: req.body.security,
                                    isVerified: false
                                });
                                newUser
                                    .save()
                                    .then(saved => {
                                        let transport = mail.createTransport({
                                            service: "gmail",
                                            host: "smtp.gmail.com",
                                            auth: {
                                                user: config.email,
                                                pass: config.password
                                            }
                                        });

                                        let mailOptions = {
                                            from: config.email,
                                            to: newUser.userName,
                                            subject: `Welcome ${newUser.firstName}`,
                                            html: sendWelcomeMail(
                                                newUser.firstName,
                                                newUser.verificationCode
                                            )
                                        };
                                        transport.sendMail(mailOptions, (err, info) => {
                                            if (err) {
                                                logger.error({ message: err });
                                                res.status(400).json({
                                                    message: err,
                                                    data: null,
                                                    success: false
                                                });
                                            } else {
                                                logger.info({
                                                    message: appConstants.registeredUserMail
                                                });
                                                res.status(201).json({
                                                    message: appConstants.registeredUserMail,
                                                    data: { AccessKey: newUser.userToken },
                                                    success: true
                                                });
                                                transport.close();
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        logger.error({ message: err });
                                    });
                            }
                        });
                    }
                });
            }
        });
    },
    login: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                logger.error({ message: err });
                return next(err);
            }
            if (!user) {
                return res.status(200).json({ info, success: false });
            }
            req.logIn(user, function (err) {
                if (err) {
                    logger.error({ message: err });
                    return next(err);
                }
                jwt.sign({ user }, config.jwtSecret, (err, token) => {
                    if (err) {
                        logger.error({ message: err });
                        res.json({ message: appConstants.errorMsg, success: false });
                    } else {
                        if (user.isVerified) {
                            logger.info({ message: appConstants.verified });
                            return res.status(200).json({
                                success: true,
                                message: appConstants.verified,
                                data: user,
                                token: token,
                                verified: true
                            });
                        } else {
                            logger.info({ message: appConstants.verifyAccountFirst });
                            return res.status(200).json({
                                success: true,
                                message: appConstants.verifyAccountFirst,
                                data: user,
                                token: token,
                                verified: false
                            });
                        }
                    }
                });
            });
        })(req, res, next);
    },
    forgotPassword: (req, res) => {
        User.findOne({ userName: req.body.username }).then(data => {
            if (data) {
                var transport = mail.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    auth: {
                        user: config.email,
                        pass: config.password
                    }
                });

                var mailOptions = {
                    from: config.email,
                    to: req.body.username,
                    subject: `Change Password Link`,
                    html: forgotPasswordMail(req.body.username)
                };
                transport.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        logger.error({ message: err });
                        res.status(400).json({
                            message: appConstants.errorMsg,
                            data: null,
                            success: false
                        });
                    } else {
                        logger.info({ message: appConstants.passwordChangeReq });
                        res.status(202).json({
                            message: appConstants.passwordChangeReq,
                            success: true
                        });
                        transport.close();
                    }
                });
            } else {
                logger({ message: appConstants.userNotFound });
                res.json({ message: appConstants.userNotFound, success: false });
            }
        });
    },
    forgotPasswordCheck: (req, res) => {
        User.findOne({ userName: req.body.username })
            .then(data => {
                if (data) {
                    hashed.genSalt(10, (err, salt) => {
                        hashed.hash(req.body.cpassword, salt, (err, hash) => {
                            if (err) {
                                logger.error({ message: err });
                                res.json({ message: appConstants.errorMsg, success: false });
                            } else {
                                if (data.security === req.body.securityAns) {
                                    User.findOneAndUpdate(req.body.id, {
                                        $set: { password: hash }
                                    })
                                        .then(changed => {
                                            if (changed) {
                                                logger.info({
                                                    message: appConstants.passwordChangedSuccessFully
                                                });
                                                res.status(200).json({
                                                    message: appConstants.passwordChangedSuccessFully,
                                                    success: true
                                                });
                                            } else {
                                                logger.err({ message: appConstants.errorMsg });
                                                res.json({
                                                    message: appConstants.errorMsg,
                                                    success: false
                                                });
                                            }
                                        })
                                        .catch(err => {
                                            logger.err({ message: err });
                                            res.json({
                                                message: appConstants.errorMsg,
                                                success: false
                                            });
                                        });
                                } else {
                                    logger.info({ message: appConstants.incorrectAns });
                                    res.json({
                                        message: appConstants.incorrectAns,
                                        success: false
                                    });
                                }
                            }
                        });
                    });
                } else {
                    logger.info({ message: appConstants.userNotFound });
                    res.status(200).json({ message: appConstants.userNotFound, success: false });
                }
            })
            .catch(err => {
                logger.err({ message: err });
                res.status(400).json({ message: appConstants.errorMsg, success: false });
            });
    },
    verifyAccount: (req, res) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user.length < 1) {
                    res.json({ message: appConstants.userNotFound, success: false });
                } else {
                    if (user.verificationCode == req.body.otp) {
                        User.findOneAndUpdate({ email: req.body.email }, { $set: { isVerified: true } })
                            .then(verified => {
                                logger.info({ message: verified });
                                res.status(202).json({
                                    message: appConstants.userVerified,
                                    success: true,
                                    isVerified: true
                                });
                            })
                            .catch(err => {
                                logger.error({ message: err });
                                res.status(400).json({
                                    message: appConstants.errorMsg,
                                    success: false,
                                    isVerified: false
                                });
                            });
                    } else {
                        logger.info({ message: appConstants.inCorrectCode });
                        res.status(202).json({
                            message: appConstants.inCorrectCode,
                            success: false,
                            isVerified: false
                        });
                    }
                }
            })
            .catch(err => {
                logger.error({ message: err });
                res.json({ message: appConstants.errorMsg, success: false });
            });
    },
    verify: (req, res) => {
        jwt.verify(req.body.token, config.jwtSecret, (err, data) => {
            if (err) {
                logger.error({ message: err });
                res.json({ data: null, success: false });
            } else {
                User.findOne({ email: data.user.email })
                    .then(user => {
                        if (user) {
                            res.status(200).json({ data: user, success: true });
                        } else {
                            res.sttaus(203).json({ data: null, success: false });
                        }
                    })
                    .catch(err => {
                        logger.error({ message: err });
                        res.json({ data: null, success: false });
                    });
            }
        });
    },
    resetPassword: (req, res) => {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                hashed.compare(req.body.password, user.password, (err, match) => {
                    if (match) {
                        hashed.genSalt(10, (err, salt) => {
                            hashed.hash(req.body.cpassword, salt, (err, hash) => {
                                User.findOneAndUpdate({ email: req.body.email }, { $set: { password: hash } })
                                    .then(changed => {
                                        if (changed) {
                                            res.status(202).json({
                                                message: appConstants.passwordChangedSuccessFully,
                                                success: true
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        logger.error({ message: err });
                                        res.status(400).json({
                                            message: appConstants.errorMsg,
                                            success: false
                                        });
                                    });
                            });
                        });
                    } else {
                        logger.info({ message: err });
                        res.json({
                            message: appConstants.incorrectPassword,
                            success: false
                        });
                    }
                });
            } else {
                logger.info({ message: appConstants.userNotFound });
                res.json({ message: appConstants.userNotFound, success: false });
            }
        });
    },
    getProfilePic: (req, res) => {
        let fileName = req.params.email + ".jpg";
        res.sendFile(`/images/users/${fileName}`, { root: "../" });
    },
    logout: (req, res) => {
        req.logout();
    },
    inviteFriend: (req, res) => {
        var transport = mail.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        var mailOptions = {
            from: config.email,
            to: req.body.email,
            subject: `Invite Link`,
            html: InviteMail(req.body.email)
        };
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                logger.error({ message: err });
                res.status(400).json({
                    message: appConstants.errorMsg,
                    data: null,
                    success: false
                });
            } else {
                logger.info({ message: appConstants.inviteSent });
                res.sttaus(202).json({
                    message: appConstants.inviteSent,
                    success: true
                });
                transport.close();
            }
        });
    }
};