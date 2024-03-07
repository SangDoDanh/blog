/**
 * department router
 * @author SangDD
 */

const express = require("express");
const departmentRestController = require("../app/controllers/DepartmentRestController");
const router = express.Router();

router.get("/:id", departmentRestController.byId);
router.get("/", departmentRestController.index);

module.exports = router;
