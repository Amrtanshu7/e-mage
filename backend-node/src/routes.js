const express = require("express");
const router = express.Router();

const { testApi } = require("./controllers");

const { backendUp } = require("./controllers");

router.get("/test", testApi);

router.get("/backend", backendUp);

module.exports = router;