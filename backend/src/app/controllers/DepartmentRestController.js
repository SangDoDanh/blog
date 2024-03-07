const DepartmentModel = require("../models/Department");
/**
 * Controller for handling Department-related API endpoints.
 * Provides methods to retrieve employee information.
 *
 * @author SangDD
 */
class DepartmentRestController {
  /**
   * [HTTP-GET] /api/departments
   * Retrieves all departments.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  async index(req, res) {
    try {
      const deps = await DepartmentModel.find({});
      res.status(200).json(deps);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async byId(req, res) {
    try {
      const deps = await DepartmentModel.findOne({ id: req.params.id });
      res.status(200).json(deps);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new DepartmentRestController();
