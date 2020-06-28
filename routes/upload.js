
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");
const upload = require("../middlewares/upload");
router.post("/", upload.array("files", 10), uploadController.uploadFiles);

module.exports = router;
