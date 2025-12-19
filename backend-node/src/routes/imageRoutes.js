const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserImages } = require("../controllers/imageController");

const router = express.Router();

router.get("/images",authMiddleware,getUserImages);

module.exports = router;