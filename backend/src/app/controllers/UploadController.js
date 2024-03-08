class UploadController {
  index(req, res) {
    res.send("<h1>Upload page!</h1>");
  }

  upload(req, res) {
    console.log(req.file);
    if (req.file) {
      res.send(`File uploaded: ${req.file.originalname}`);
    } else {
      res.send("Upload failed!");
    }
  }
}

module.exports = new UploadController();
