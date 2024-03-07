const EmployeeModel = require("../models/Employee");
const DepartmentModel = require("../models/Department");
class EmployeeService {
  async getEmployeeManagerByID(id) {
    if (!id) {
      return null;
    }
    const empl = await EmployeeModel.findOne({ id: id });
    console.log(empl);
    if (!empl["e_main"]) {
      return empl;
    }

    if (!empl["department_id"]) return null;

    const departmnet = await DepartmentModel.findOne({
      id: empl["department_id"],
    });
    return await EmployeeModel.findOne({ id: departmnet["dep_main"] });
  }

  // get employee manager
  async getEmployeeManager(empl) {
    if (!empl || !empl.id) {
      return null;
    }

    if (!empl["e_main"]) {
      return empl;
    }

    if (!empl["department_id"]) return null;

    const departmnet = await DepartmentModel.findOne({
      id: empl["department_id"],
    });
    return await EmployeeModel.findOne({ id: departmnet["dep_main"] });
  }

  // get employeeByID
  async getEmployeeByID(id) {
    if (!id) {
      return null;
    }
    try {
      const empl = await EmployeeModel.findOne({ id: id });
      return empl;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getEmployeeByDepId(depId) {
    if (!depId) return null;
    const empls = await EmployeeModel.find({ department_id: depId });
    return empls;
  }

  isOder(input) {
    if (!input) return false;
    const inputArray = input.split("_");
    return (
      inputArray.length > 1 &&
      inputArray[0].split("oder").join("").toLowerCase()
    );
  }
}
module.exports = new EmployeeService();
