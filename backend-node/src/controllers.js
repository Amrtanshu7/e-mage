const { processImage } = require("./services/cppClient");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const CPP_SERVICE_URL = "http://localhost:8000";
const Image = require("../src/models/Image")

exports.uploadAndSendToCpp = async (req,res) => {
    console.log("upload and send to c++ request received ");
    const userId = req.user.userId;
    const filterType = req.query.filter || "grayscale";
    console.log("requested filter:", filterType);

    if(!req.file)
    {
        return res.status(400).json ({message: "No image uploaded"});
    }
    
    //original image

    const originalImagePath = req.file.path;
    console.log("image uploaded by user:",userId);
    console.log("original image path:",originalImagePath);

    //absolute path for reading
    const imagePath = path.join(__dirname,"..",originalImagePath);

    console.log("reading image from disk:",imagePath);

    const imageBuffer = fs.readFileSync(imagePath);

    console.log("Image buffer size(bytes):",imageBuffer.length);

    //prepare processed image path

    const processedDir = path.join("uploads","processed");
    if( !fs.existsSync(processedDir))
    {
        fs.mkdirSync(processedDir, { recursive : true});
    }

    const processedImageFilename = `processed-${Date.now()}.jpg`;
    const processedImagePath = path.join(processedDir,processedImageFilename);

    try{
        const cppResponse = await axios.post(
            `${CPP_SERVICE_URL}/process-image`,
            imageBuffer,
            {
                headers: 
                {
                    "Content-Type": "application/octet-stream",
                    "X-Image-Filter": filterType
                },
                responseType: "arraybuffer"
            }
        );

        const processedBuffer = Buffer.from(cppResponse.data);

        console.log("bytes received back from c++:", processedBuffer.length);

        //save the processed image 
        fs.writeFileSync(processedImagePath, processedBuffer);
        console.log("processed image saved at:", processedImagePath);

        //save metadata to db

        const imageDoc = new Image({
            userId,
            originalImagePath,
            processedImagePath,
            filterType
        });

        await imageDoc.save();
        console.log("image metadata saved for user:", userId);

        /* Send processed image back to client */

        res.set({
            "Content-Type": "image/jpeg",
            "Content-Disposition": "attachement; filename=processed.jpg",
            "Content-Length": processedBuffer.length
        });

        res.send(processedBuffer);

        console.log("C++ responded successfully");

    } catch (err) {
        console.error("error sending image to c++:",err.message);
        res.status(500).json({message:" image processing failed "});
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