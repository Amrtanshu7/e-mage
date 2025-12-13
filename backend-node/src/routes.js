const express = require("express");
const router = express.Router();

const upload = require("./middleware/upload");

const {callCppService, uploadImage, backendUp,testApi } = require("./controllers");

router.get("/test", testApi);

router.get("/backend", backendUp);

router.post("/call-cpp", callCppService);

router.post("/upload",upload.single("image"),uploadImage);
module.exports = router;