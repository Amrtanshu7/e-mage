const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserImages, downloadImage,deleteImage} = require("../controllers/imageController");

const router = express.Router();

router.get("/images",authMiddleware,getUserImages);
router.get("/images/:id/download",authMiddleware,downloadImage);
router.delete("/images/:id",authMiddleware,deleteImage);


module.exports = router;