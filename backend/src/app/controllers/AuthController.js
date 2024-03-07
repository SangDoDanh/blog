const EmployeeModel = require("../models/Employee");
const bcrypt = require("bcryptjs");
/**
 * Controller for handling Department-related API endpoints.
 * Provides methods to retrieve employee information.
 *
 * @author SangDD
 */
class AuthController {
  /**
   * [HTTP-GET] /login
   * Retrieves all departments.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async index(req, res) {
    res.send("<h1>Login Form</h1>");
  }

  /**
   * [HTTP-POST] /login
   * Retrieves all departments.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const employee = await EmployeeModel.findOne({ username: username });
      if (!employee) {
        return res
          .status(404)
          .json({ message: "This account does not exist!" });
      }
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Username or Password is invalid!" });
      }
      employee.password = "";
      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new AuthController();
