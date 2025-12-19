const Image = require("../models/Image");

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

