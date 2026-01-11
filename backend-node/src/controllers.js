require("dotenv").config();
const { processImage } = require("./services/cppClient");
const axios = require("axios");
const CPP_SERVICE_URL = process.env.CPP_SERVICE_URL;
const Image = require("../src/models/Image")
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../services/s3");


exports.uploadAndSendToCpp = async (req, res) => {
    console.log("Upload & process request");

    const userId = req.user.userId;
    const filterType = req.query.filter || "grayscale";

    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    console.log("User:", userId);
    console.log("Filter:", filterType);

    try {
        // Multer memory buffer
        const originalBuffer = req.file.buffer;

        console.log("Original image size:", originalBuffer.length);

        // Unique keys in S3
        const originalKey = `original/${userId}/${Date.now()}-${req.file.originalname}`;
        const processedKey = `processed/${userId}/${Date.now()}.jpg`;

        // Upload original to S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: originalKey,
            Body: originalBuffer,
            ContentType: req.file.mimetype
        }));

        console.log("Uploaded original to S3:", originalKey);

        // Send to C++ for processing
        const cppResponse = await axios.post(
            `${process.env.CPP_SERVICE_URL}/process-image`,
            originalBuffer,
            {
                headers: {
                    "Content-Type": "application/octet-stream",
                    "X-Image-Filter": filterType
                },
                responseType: "arraybuffer"
            }
        );

        const processedBuffer = Buffer.from(cppResponse.data);
        console.log("Processed bytes:", processedBuffer.length);

        // Upload processed image to S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: processedKey,
            Body: processedBuffer,
            ContentType: "image/jpeg"
        }));

        console.log("Uploaded processed to S3:", processedKey);

        // Save metadata to Mongo
        const imageDoc = new Image({
            userId,
            originalImagePath: originalKey,
            processedImagePath: processedKey,
            filterType
        });

        await imageDoc.save();
        console.log("Saved DB record");

        // Send processed image back to client
        res.set({
            "Content-Type": "image/jpeg",
            "Content-Disposition": "inline; filename=processed.jpg",
            "Content-Length": processedBuffer.length
        });

        res.send(processedBuffer);

    } catch (err) {
        console.error("Upload & process error:", err);
        res.status(500).json({ message: "Image processing failed" });
    }
};

exports.callCppService = async (req,res) => {
    
    try{
        const { imageData } = req.body;

        const result = await processImage(imageData);

        console.log("sending response back to frontend:", result);

        res.json({
            message: "C++ service responded successfully",
            cppResponse: result 
        });
    } catch(error) {
        console.error("error in callCppService:",error);
        res.status(500).json({
            message: "Failed to contact C++ service",
            error: error.message
        });
    }
};

exports.uploadImage = async (req,res) => {
    console.log("image upload request received ");

    if(!req.file) {
        console.error("no file uploaded");
        return res.status(400).json({ message: "No image uploaded "});
    }

    console.log("image received :");
    console.log({
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
    });

    res.json({
        message:"Image uploaded successfully",
        file: {
            filename: req.file.filename,
            path: req.file.path
        }
    });
};

exports.testApi = (req,res) =>{
    res.json({
        message: "Backend route working",
        status: "success"
    });
};

exports.backendUp = (req,res) => {
    res.json({
        message :"Backend Up",
        status: "success"
    })
}