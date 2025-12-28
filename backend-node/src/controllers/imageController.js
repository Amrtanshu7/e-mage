const Image = require("../models/Image");
const path = require("path");
const fs = require("fs");

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

exports.previewImage = async (req,res) => {
    try{
        console.log("Image preview request received");

        const userId = req.user.userId;
        const imageId = req.params.id;

        console.log("user id:",userId);
        console.log("imageId:",imageId);

        const image = await Image.findOne({ _id: imageId, userId});

        if(!image) {
            console.log("Image not found or unauthorized");
            return res.status(404).json({ message: "Image not found "});
        }

        const filePath = path.join(__dirname,"..","..",image.processedImagePath);
        console.log("resolved preview path:", filePath);

        if(!fs.existsSync(filePath))
        {
            console.log("processed image missing on disk");
            return res.status(404).json({message: "File not found"});
        }

        res.setHeader("Content-Type", "image/jpeg");

        fs.createReadStream(filePath).pipe(res);

    } catch(err) {
        console.error("Preview error: ",err.message);
        res.status(500).json({message: "Failed to load image preview"});
    }
};


exports.downloadImage = async (req, res) => {
    try{
        console.log("download request received ");
        const userId = req.user.userId;
        const imageId = req.params.id;

        console.log("userid:",userId);
        console.log("imageId:",imageId);

        const image = await Image.findOne({
            _id: imageId,
            userId
        });

        if(!image){
            console.log("iamge not found in db or doesnt belong to this user");
            return res.status(404).json({
                message: "Image not found"
            });
        }
        
        console.log("image found in db");
        console.log("Processed image path (DB):", image.processedImagePath);

        const filePath = path.join(__dirname,"..","..",image.processedImagePath);

        console.log("Resolved absolute file path:", filePath);

        if(!fs.existsSync(filePath)) {
            console.log("File does not exist on disk");
            return res.status(404).json({message: "Processed image not found"});
        }
        
        console.log("sending file for download ");
        res.download(filePath);
    } catch(err) {
        console.error("Download error:",err.message);
        res.status(500).json({message: "Failed to download image"});
    }
}

exports.deleteImage = async (req,res) => {
    try{
        console.log("delete image request received ");

        const userId = req.user.userId;
        const imageId = req.params.id;

        console.log("user id:",userId);
        console.log("image id:",imageId);

        const image = await Image.findOne({
            _id: imageId,
            userId
        });

        if(!image){
            console.log("image not found or not owned by user");
            return res.status(404).json({message: "Image not found"});
        }

        console.log("image found in db");
        console.log("db original path:",image.originalImagePath);
        console.log("db processedImagePath", image.processedImagePath);

        console.log("__dirname:",__dirname);

        const originalPath = path.join(__dirname,"..","..",image.originalImagePath);
        const processedPath = path.join(__dirname,"..","..",image.processedImagePath);

        console.log("Resolved originalPath:", originalPath);
        console.log("Resolved processedPath:", processedPath);

        if(fs.existsSync(originalPath))
        {
            fs.unlinkSync(originalPath);
            console.log("deleted original image:",originalPath);
        }

        if(fs.existsSync(processedPath)) {
            fs.unlinkSync(processedPath);
            console.log("Deleted processed image :",processedPath);
        }

        await Image.deleteOne({_id: imageId});

        console.log("image record deleted from DB");

        res.status(200).json({ message: "Image deleted successfully"});
    } catch (err) {
        console.error(" Delete image error: ", err.message);
        res.status(500).json({message: "Failed to delete image"});
    }
};

