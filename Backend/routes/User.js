const express = require("express");
const router = express.Router();
const UserService = require("../Services/User.service");
router.post("/register", UserService.register);
router.post("/login", UserService.login);
router.post("/logout", UserService.logout);

router.post("/forgotPassword", UserService.forgotPassword);

router.put("/forgotPasswordCheck", UserService.forgotPasswordCheck);
router.post("/verifyAccount", UserService.verifyAccount);
router.post("/verify", UserService.verify);
router.post("/resetPassword", UserService.resetPassword);
router.post("/invite", UserService.inviteFriend);
router.get("/profilePic/:email", UserService.getProfilePic);
module.exports = router;