const express = require("express");
const NotificationService = require("../Services/Notification.service");
const router = express.Router();
router.get('/', (req, res) => {
    res.json({ message: "Notifications working" })
})
router.get("/notifications/:id", NotificationService.getNotifications);
router.put("/clear/:id", NotificationService.clearAllNotifications);
module.exports = router;