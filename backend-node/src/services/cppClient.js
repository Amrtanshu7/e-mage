const axios = require("axios");

const CPP_SERVICE_URL = "http://localhost:8000";

exports.processImage = async (imageData) => {
    try{
        const response = await axios.post(
            `${CPP_SERVICE_URL}/process-image`,
            {
                image: imageData
            }
        );

        console.log("received reponse from c++:",response.data);

        return response.data;

    } catch (err) {
        console.error("Error contacting C++ service:",err.message);
        throw err;
    }
};