const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserImages, downloadImage} = require("../controllers/imageController");

const router = express.Router();

router.get("/images",authMiddleware,getUserImages);
router.get("/images/:id/download",authMiddleware,downloadImage);

module.exports = router;