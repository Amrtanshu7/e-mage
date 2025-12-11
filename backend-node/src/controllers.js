const { processImage } = require("./services/cppClient");

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