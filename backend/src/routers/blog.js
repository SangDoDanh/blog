/**
 * department router
 * @author SangDD
 */

const express = require("express");
const blogRestController = require("../app/controllers/BlogRestController");
const uploadController = require("../app/controllers/UploadController");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// router.get("/:id", departmentRestController.byId);
router.post("/", blogRestController.upload);
router.post("/upload-image", upload.single("image"), uploadController.upload);
router.get("/", blogRestController.index);

module.exports = router;
