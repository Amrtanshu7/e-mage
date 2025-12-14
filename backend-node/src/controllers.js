const { processImage } = require("./services/cppClient");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const CPP_SERVICE_URL = "http://localhost:8000";


exports.uploadAndSendToCpp = async (req,res) => {
    console.log("upload and send to c++ request received ");

    if(!req.file)
    {
        return res.status(400).json ({message: "No image uploaded"});
    }

    const imagePath = path.join(__dirname,"..",req.file.path);

    console.log("reading image from disk:",imagePath);

    const imageBuffer = fs.readFileSync(imagePath);

    console.log("Image buffer size(bytes):",imageBuffer.length);

    try{
        const cppResponse = await axios.post(
            `${CPP_SERVICE_URL}/process-image`,
            imageBuffer,
            {
                headers: 
                {
                    "Content-Type": "application/octet-stream"
                },
                responseType: "arraybuffer"
            }
        );

        const returnedBuffer = Buffer.from(cppResponse.data);

        console.log("bytes received back from c++:", returnedBuffer.length);

        console.log("C++ responded successfully");

        res.json({
            message: "Binary round-trip completed",
            bufferSize: imageBuffer.length,
            cppResponse: returnedBuffer.length
        });
        
    } catch (err) {
        console.error("error sending image to c++:",err.message);
        res.status(500).json({message:" Failed to send image to C++"});
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