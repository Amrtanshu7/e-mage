const express = require("express");
const router = express.Router();

const { testApi } = require("./controllers");

const { backendUp } = require("./controllers");

const {callCppService } = require("./controllers");

router.get("/test", testApi);

router.get("/backend", backendUp);

router.post("/call-cpp", callCppService);

module.exports = router;