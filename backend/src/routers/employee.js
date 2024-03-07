/**
 * employee router
 * @author SangDD
 */
const express = require("express");
const employeeRestController = require("../app/controllers/EmployeeRestController");
const router = express.Router();
router.post("/test-validate", employeeRestController.testValidate);
router.get("/:id/manager", employeeRestController.manager);
router.get("/:id", employeeRestController.byID);
router.get("/dep/:id", employeeRestController.byDepID);
router.get("/:eid/dep/:did", employeeRestController.byRole);
router.get("/", employeeRestController.index);

module.exports = router;
