const express = require("express");
const router = express.Router();
const postService = require("../Services/Post.service");
router.post("/post", postService.savePost);
router.get("/posts/:page/:pagination", postService.getPosts);
router.post("/like", postService.like);
router.get("/getOldestPosts", postService.getOldestPosts);
router.get("/getLatestPosts", postService.getLatestPosts);
router.post("/unlike", postService.unlike);
router.get("/:id", postService.getSinglePost);
router.post("/comment", postService.comment);
router.post("/comment/:commentId/reply", postService.reply);
router.get("/display/:post", postService.displayPost);
router.get("/category/:category", postService.getCategoryPosts);
router.get("/posts/mostClicked", postService.mostClicked);
router.get("/posts/mostCommented", postService.mostCommented);
router.get("/posts/userPosts/:id/:page/:pagination", postService.getUserPosts);

module.exports = router;