const EmployeeModel = require("../models/Employee");
const employeeService = require("./EmployeeService");
const validateService = require("./comcon/ValidateService");
const DepartmentModel = require("../models/Department");
class EmployeeValidateService {
  constructor() {
    this.TOTAL_BY_ADMIN = 10000000;
    this.TOTAL_BY_LEADER = 5000000;
    this.TOTAL_BY_MEMBER = 2000000;
  }
  async validate(bill) {
    if (!bill) {
      return {
        message: "Khong co doi tuong de validate",
        code: "404",
        param: [],
      };
    }
    // validate employee
    const empl = await employeeService.getEmployeeByID(bill.employeeID);
    if (!this.isEmployeeExist(empl, bill)) {
      return {
        message: "Employee not exist",
        code: "404",
        param: [],
      };
    }
    // validate deadline
    const deadline = bill.deadline;
    if (!validateService.isDateValid(deadline, "YYYY/MM/DD")) {
      return {
        message: "Employee[deadline] is invalid!",
        code: "E009",
        param: [deadline, "YYYY/MM/DD"],
      };
    }
    // validate priority *:
    const priority = `${bill.priority}`;
    if (!validateService.isRequired(priority)) {
      return {
        message: "Employee[priority] is invalid!",
        code: "E002",
        param: ["priority"],
      };
    }

    // validate Form name * :
    const formName = bill.template;
    if (!validateService.isRangeLength(formName, 1, 30)) {
      return {
        message: "Employee[Name template] is invalid!",
        code: "E004",
        param: ["Name template", "30"],
      };
    }
    // validate Type *:
    const type = `${bill.type}`;
    if (!validateService.isRequired(type)) {
      return {
        message: "Employee[type] is invalid!",
        code: "E002",
        param: ["type"],
      };
    }

    // validate Description * :
    const description = bill.description;
    if (!validateService.isRangeLength(description, 20, 200)) {
      return {
        message: "Employee[description] is invalid!",
        code: "E004",
        param: ["description", "20", "200"],
      };
    }
    // validate orders * :
    if (!(await this.isOderValidByRole(bill))) {
      return {
        message: "Employee[Total by roles] is invalid!",
        code: "E004",
        param: ["Total by roles"],
      };
    }

    // validate ToDepartment * :
    const depId = bill.departmentTo;
    if (!(await this.isValidDepartmentTo(depId))) {
      return {
        message: "Employee[ToDepartment] is invalid!",
        code: "E004",
        param: ["ToDepartment"],
      };
    }
    // Validate ToEmployee * :
    const eIdTO = bill.employeeTo;
    const eIdFrom = bill.employeeID;
    const depTo = await this.isValidDepartmentTo(depId);
    if (!(await this.isValidEmployeeTo(eIdFrom, eIdTO, depTo))) {
      return {
        message: "Employee[EmployeeTo] is invalid!",
        code: "E004",
        param: ["EmployeeTo"],
      };
    }
    // All ok
    return {
      message: "Validate ok",
      code: "200",
    };
  }

  async isValidDepartmentTo(depId) {
    if (!depId) return false;
    const deps = await DepartmentModel.findOne({ id: depId });
    return deps;
  }

  async isValidEmployeeTo(eIdFrom, eIdTo, depTo) {
    if (!eIdFrom || !eIdTo || !depTo) return false;
    const eFrom = await EmployeeModel.findOne({ id: eIdFrom });
    const eTo = await EmployeeModel.findOne({ id: eIdTo });
    if (depTo.id != eTo.department_id) return false;
    if (eFrom.roles.length >= eTo.roles.length) return false;
    return true;
  }

  async isOderValidByRole(bill) {
    if (!bill) return false;
    const orders = bill.oders;
    const e = await employeeService.getEmployeeByID(bill.employeeID);
    if (!e) return false;
    const roles = e.roles;
    if (!roles || roles.length < 1) return false;
    if (!orders || orders.length < 1) return false;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      const oder = orders[i];
      const quantity = Number(oder.quantity);
      const price = Number(oder.price);
      if (isNaN(quantity) || isNaN(price)) {
        total += 0;
      } else {
        total += quantity * price;
      }
    }
    return this.isTotalByRole(roles, Number(total));
  }

  isTotalByRole(roles, total) {
    if (!roles || roles.length === 0) return false;
    if (!total || isNaN(total)) return false;
    console.log(total);
    switch (roles.length) {
      case 1:
        console.log("member");
        console.log(this.TOTAL_BY_MEMBER >= total);
        return this.TOTAL_BY_MEMBER >= total;
      case 2:
        console.log("leader");
        return this.TOTAL_BY_LEADER >= total;

      case 3:
        console.log("admin");
        return this.TOTAL_BY_ADMIN >= total;
    }
  }

  isEmployeeExist(e, bill) {
    if (!e) return false;
    return (
      e.id == bill.employeeID &&
      `${e.first_name} ${e.last_name}` == bill.fullName &&
      e.department_id == bill.department
    );
  }
}

module.exports = new EmployeeValidateService();
