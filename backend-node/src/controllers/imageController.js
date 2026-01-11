const Image = require("../models/Image");
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../services/s3");

exports.getUserImages = async(req,res) => {
    try{

        const userId = req.user.userId;
        console.log("Fetching images for user:",userId);
        const images = await Image.find({ userId }).sort({createdAt: -1});
        res.status(200).json({ 
            count: images.length,
            images
        });
    } catch (err) {
        console.error("error fetching images:",err.message);
        res.status(500).json({message:"Failed to fetch images"});
    }
};

exports.previewImage = async (req, res) => {
    try {
        console.log("Image preview request received");

        const userId = req.user.userId;
        const imageId = req.params.id;

        const image = await Image.findOne({ _id: imageId, userId });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        console.log("Streaming from S3:", image.processedImagePath);

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: image.processedImagePath
        });

        const s3Object = await s3.send(command);

        res.setHeader("Content-Type", "image/jpeg");
        s3Object.Body.pipe(res);

    } catch (err) {
        console.error("Preview error:", err);
        res.status(500).json({ message: "Failed to load image preview" });
    }
};


exports.downloadImage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const imageId = req.params.id;

        const image = await Image.findOne({ _id: imageId, userId });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        console.log("Downloading from S3:", image.processedImagePath);

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: image.processedImagePath
        });

        const s3Object = await s3.send(command);

        res.setHeader("Content-Disposition", "attachment; filename=processed.jpg");
        res.setHeader("Content-Type", "image/jpeg");

        s3Object.Body.pipe(res);

    } catch (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Failed to download image" });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const imageId = req.params.id;

        const image = await Image.findOne({ _id: imageId, userId });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        console.log("Deleting from S3:", image.originalImagePath, image.processedImagePath);

        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: image.originalImagePath
        }));

        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: image.processedImagePath
        }));

        await Image.deleteOne({ _id: imageId });

        res.status(200).json({ message: "Image deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Failed to delete image" });
    }
};

