const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        originalImagePath: {
            type: String,
            required: true
        },
        processedImagePath: {
            type: String,
            required: true
        },
        filterType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Image", imageSchema);