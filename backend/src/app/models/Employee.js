const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose Schema for representing a Employee.
 * @author SangDD
 */
const Employee = new Schema({
  id: {
    type: Number,
  },
  first_name: {
    type: String,
    maxlength: 255,
  },
  last_name: {
    maxlength: 255,
    type: String,
  },
  email: {
    maxlength: 255,
    type: String,
  },
  department_id: {
    type: Number,
  },
  e_main: {
    type: Number,
  },
  roles: { type: [String] },
  username: { type: String },
  password: { type: String },
});

const EmployeeModel = mongoose.model("Employee", Employee);
module.exports = EmployeeModel;
