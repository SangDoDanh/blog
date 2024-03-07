const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Mongoose Schema for representing a Department.
 * @author SangDD
 */
const Department = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    maxlength: 255,
  },
  dep_main: {
    type: Number,
  },
});

const DepartmentModel = mongoose.model("Department", Department);
module.exports = DepartmentModel;
