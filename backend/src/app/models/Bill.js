const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose Schema for representing a bill.
 * @author SangDD
 */
const Bill = new Schema({
  fullName: { type: String, maxLength: 50 },
  employeeID: { type: Number },
  department: { type: Number },
  priority: { type: Number },
  deadline: { type: Date },
  template: { type: String },
  type: { type: String },
  description: { type: String, maxLength: 200 },
  oders: [{ name: String, quantity: String, price: String }],
  files: { type: [String], default: ["NO_FILES"] },
  employeeTo: { type: Number },
  departmentTo: { type: Number },
});

const BillModel = mongoose.model("Bill", Bill);
module.exports = BillModel;
