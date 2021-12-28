const express = require("express");
const CategoryService = require("../Services/Categories.service");
const router = express.Router();
router.get("/categories", CategoryService.getCategory);
module.exports = router;