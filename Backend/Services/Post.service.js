const Post = require('../Modal/Post');
const appConstants = require('../appConstants/appConstants');
const NotificationsService = require('./Notification.service');
const CategoryService = require('../Services/Categories.service');
const { getLogger } = require('../utility/utility');
const logger = getLogger();
module.exports = {
    savePost: (req, res) => {
        let UserPost = {
            title: req.body.title,
            creator: req.body.creator,
            category: req.body.category,
            userId: req.body.userId,
            profilePic: req.body.profilePic,
            post: req.body.creator +
                req.body.title +
                "-" +
                new Date().getDate() +
                "-" +
                new Date().getHours() +
                ":" +
                new Date().getMinutes() +
                ".jpg"
        };
        let savedPost = new Post(UserPost);
        savedPost
            .save()
            .then(saved => {
                CategoryService.setCategory(req.body.category).then((response) => {
                    if (response.success) {
                        logger.info({ message: response });
                    }
                }).catch(error => {
                    logger.error({ message: error });
                });
                req.files.post.mv("../images/posts/" + saved.post, err => {
                    if (err) {
                        logger.error({ message: err });
                    } else {
                        logger.info({ message: saved });
                    }
                });
                res.json({
                    message: appConstants.postAddedSuccessfully,
                    success: true
                });
            })
            .catch(err => {
                logger.error({ message: err });
                res.json({
                    message: appConstants.errorMsg,
                    success: false
                });
            });
    },
    getPosts: (req, res) => {
        let page = Number(req.params.page);
        let pagination = Number(req.params.pagination);
        Post.find({}).skip((page - pagination) * 2).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: appConstants.errorMsg,
                    data: null,
                    success: false
                });
            });
    },
    getUserPosts: (req, res) => {
        let page = Number(req.params.page);
        let pagination = Number(req.params.pagination);
        Post.find({ userId: req.params.id }).sort({ createdAt: -1 }).skip((page - pagination) * 2).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: appConstants.errorMsg,
                    data: null,
                    success: false
                });
            });
    },
    like: (req, res) => {
        Post.findOneAndUpdate({
                _id: req.body.postId
            }, {
                $push: {
                    likes: {
                        userId: req.body.userId,
                        postId: req.body.postId
                    }
                }
            })
            .then(response => {
                NotificationsService.likeNotification(
                    response.userId,
                    req.body.userId,
                    response._id
                ).then(response => {
                    if (response.success) {
                        logger.info({ message: appConstants.postUpdatedSuccessfully });
                        res.status(200).json({ message: appConstants.postUpdatedSuccessfully });
                    } else {
                        res.status(400).json({ message: appConstants.postUpdatedSuccessfully });
                    }
                });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({ message: appConstants.errorMsg, success: false });
            });
    },
    unlike: (req, res) => {
        Post.findOneAndUpdate({
                _id: req.body.postId
            }, {
                $pull: {
                    likes: {
                        userId: req.body.userId,
                        postId: req.body.postId
                    }
                }
            })
            .then(response => {
                res.status(200).json({
                    message: appConstants.postUpdatedSuccessfully,
                    success: true
                });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({ message: appConstants.errorMsg, success: false });
            });
    },
    comment: (req, res) => {
        let comment = req.body.userComment;
        Post.findOneAndUpdate({ _id: req.body.pid }, {
            $push: {
                comments: { 
                    userId: req.body.userId,
                    commentUser: req.body.commentUser,
                    comment: comment,
                    profilePic: req.body.profilePic
                }
            }
        }).then(post => {
            NotificationsService.commentNotification(
                post.userId,
                req.body.userId,
                req.body.pid
            ).then(response => {
                if (response.success) {
                    logger.info({ message: appConstants.postUpdatedSuccessfully });
                    res.status(201).json({ message: appConstants.postUpdatedSuccessfully });
                } else {
                    res.status(201).json({ message: appConstants.postUpdatedSuccessfully });
                }
            });
        });
    },
    reply: (req, res) => {
        let comment = req.body.userComment;
        Post.findOneAndUpdate({ _id: req.body.pid ,'comments._id':req.params.commentId}, {
            $push: {
                'comments.$.reply': {
                    userId: req.body.userId,
                    commentUser: req.body.commentUser,
                    comment: comment,
                    profilePic: req.body.profilePic
                }
            }
        }).then(post => {
            logger.info({message:post});
            NotificationsService.commentNotification(
                post.userId,
                req.body.userId,
                req.body.pid
            ).then(response => {
                logger.info({message:response});
                if (response.success) {
                    logger.info({ message: appConstants.postUpdatedSuccessfully });
                    res.status(201).json({ message: appConstants.postUpdatedSuccessfully });
                } else {
                    res.status(201).json({ message: appConstants.postUpdatedSuccessfully });
                }
            });
        }).catch(error=>{
            logger.error({message:error});
        });
    },
    getSinglePost: (req, res) => {
        Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
            .then(post => {
                if (post) {
                    res.json({ message: null, success: true, data: post });
                } else {
                    logger.info({ message: appConstants.postNotFound });
                    res.status(200).json({
                        message: appConstants.postNotFound,
                        success: false,
                        data: null
                    });
                }
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: appConstants.errorMsg,
                    success: false,
                    data: null
                });
            });
    },
    displayPost: (req, res) => {
        let post = req.params.post;
        res.sendFile(`/images/posts/${post}`, { root: "../" });
    },
    getLatestPosts: (req, res) => {
        Post.find({})
            .sort({ createdAt: -1 }).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.jstatus(400).son({
                    message: err,
                    data: null,
                    success: false
                });
            });
    },
    getCategoryPosts: (req, res) => {
        Post.find({ category: req.params.category }).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: err,
                    data: null,
                    success: false
                });
            });
    },
    getOldestPosts: (req, res) => {
        Post.find({}).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: err,
                    data: null,
                    success: false
                });
            });
    },
    mostClicked: (req, res) => {
        Post.find({}).sort({ views: -1 }).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: err,
                    data: null,
                    success: false
                });
            });
    },
    mostCommented: (req, res) => {
        Post.find({}).sort({ comments: -1 }).limit(2)
            .then(posts => {
                res.status(200).json({ message: null, data: posts, success: true });
            })
            .catch(err => {
                logger.error({ message: err });
                res.status(400).json({
                    message: err,
                    data: null,
                    success: false
                });
            });
    }

};