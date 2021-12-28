const appConstants = require("../appConstants/appConstants");
const User = require("../Modal/User");
const { getLogger } = require("../utility/utility");
const logger = getLogger();
module.exports = {
    getNotifications: (req, res) => {
        User.findOne({ _id: req.params.id })
            .then(user => {
                logger.info({ message: user.notifications });
                res.status(200).json({ success: true, data: user.notifications });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({ success: false, data: null });
            });
    },
    clearAllNotifications: (req, res) => {
        User.findByIdAndUpdate(req.params.id, { $set: { notifications: [] } }).then(user => {
            logger.info({ message: user });
            res.status(202).json({ success: true, message: appConstants.clearNotifications });
        }).catch(err => {
            logger.error({ message: err });
            res.status(400).json({ success: false, message: appConstants.errorMsg });
        })
    },
    likeNotification: (userId, likedUser, postId) => {
        return new Promise((resolve, reject) => {
            if (userId !== likedUser) {
                User.findById(likedUser).then(user => {
                    User.findByIdAndUpdate(userId, {
                            $push: {
                                notifications: {
                                    userId: likedUser,
                                    notification: appConstants.likeNotification.replace(
                                        "{username}",
                                        `${user.firstName} ${user.lastName}`
                                    ),
                                    postId: postId
                                }
                            }
                        })
                        .then(data => {
                            logger.info({ message: data });
                            resolve({ success: true });
                        })
                        .catch(err => {
                            logger.error({ message: err });
                            reject({ success: false });
                        });
                });
            }
        });
    },
    commentNotification: (userId, commentUser, postId) => {
        return new Promise((resolve, reject) => {
            if (userId !== commentUser) {
                User.findById(commentUser).then(user => {
                    User.findByIdAndUpdate(userId, {
                            $push: {
                                notifications: {
                                    userId: commentUser,
                                    notification: appConstants.commentNotification.replace(
                                        "{username}",
                                        `${user.firstName} ${user.lastName}`
                                    ),
                                    postId: postId
                                }
                            }
                        })
                        .then(data => {
                            resolve({ success: true });
                        })
                        .catch(err => {
                            logger.error({ message: err });
                            reject({ success: false });
                        });
                });
            } else {
                resolve({ success: true });
            }
        });
    }
};