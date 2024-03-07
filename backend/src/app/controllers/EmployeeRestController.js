const EmployeeModel = require("../models/Employee");
const EmployeeService = require("../service/EmployeeService");
const employeeService = require("../service/EmployeeService");
const EmployeeValidateService = require("../service/EmployeeValidateService");
/**
 * Controller for handling Employee-related API endpoints.
 * Provides methods to retrieve employee information.
 *
 * @author SangDD
 */
class EmployeeRestController {
  /**
   * [HTTP-GET] /api/employees
   * Retrieves all employees.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async index(req, res) {
    try {
      const empl = await EmployeeModel.find({});
      res.json(empl);
    } catch (error) {
      res.status(500).json({ msg: "Not Found Employee!", status: 500 });
    }
  }

  /**
   * [HTTP-GET] /api/employees/dep/:id
   * Retrieves employees by department ID.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async byDepID(req, res) {
    try {
      const empl = await EmployeeModel.find({ department_id: req.params.id });
      res.json(empl);
    } catch (error) {
      res.status(500).json({
        msg: `Not Found Employee by department ID!`,
        dep_id: req.params.id,
        status: 500,
      });
    }
  }

  /**
   * [HTTP-GET] /api/employees/:id
   * Retrieves an employee by ID.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async byID(req, res) {
    try {
      const empl = await EmployeeModel.findOne({ id: req.params.id });
      res.json(empl);
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Not Found Employee!", id: req.params.id, status: 500 });
    }
  }

  /**
   * [HTTP-GET] /api/employees/:id/manager
   * Retrieves the manager of an employee by ID.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async manager(req, res) {
    try {
      const empl = await employeeService.getEmployeeManagerByID(req.params.id);
      res.json(empl);
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Not Found Employee!", id: req.params.id, status: 500 });
    }
  }

  /**
   * [HTTP-POST] /api/employees/test-validate
   * Implement test validate backend.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async testValidate(req, res) {
    try {
      const bill = req.body;
      console.log(req.body);

      const result = await EmployeeValidateService.validate(bill);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Not Found Employee!", id: req.params.id, status: 500 });
    }
  }

  /**
   * [HTTP-GET] /api/employees/:eid/dep/:did
   * Get all employee by role.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async byRole(req, res) {
    try {
      const emplID = req.params.eid;
      const depID = req.params.did;
      if (!emplID || !depID) {
        return res
          .status(404)
          .json({ message: `Not Found employee with employee` });
      }
      const emplsByDepartment = await employeeService.getEmployeeByDepId(depID);
      if (!emplsByDepartment) {
        return res
          .status(404)
          .json({ message: `Not Found employee with employee` });
      }
      const empl = await EmployeeService.getEmployeeByID(emplID);
      if (!empl) {
        return res.status(404).json({ message: `Not Found employee` });
      }
      const results = emplsByDepartment.filter(
        (e) => e.roles.length > empl.roles.length
      );
      return res.status(200).json(results);
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Not Found Employee!", id: req.params.id, status: 500 });
    }
  }
}

module.exports = new EmployeeRestController();
