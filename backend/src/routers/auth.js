/**
 * upload router, router handler upload files and sendmail
 * @author SangDD
 */
const express = require("express");

const authController = require("../app/controllers/AuthController");
const router = express.Router();

router.post("/", authController.login);
router.get("/", authController.index);

module.exports = router;
