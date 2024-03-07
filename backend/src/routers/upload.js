/**
 * upload router, router handler upload files and sendmail
 * @author SangDD
 */
const express = require("express");

const uploadController = require("../app/controllers/UploadController");
const router = express.Router();

router.post("/", uploadController.upload);
router.get("/", uploadController.index);

module.exports = router;
