const employeeRouter = require("./employee");
const depRouter = require("./department");
const uploadRouter = require("./upload");
const authRouter = require("./auth");
/**
 * Config for the router
 * @author SangDD
 * @param {*} app
 */
function route(app) {
  app.use("/api/departments", depRouter);
  app.use("/api/employees", employeeRouter);
  app.use("/upload", uploadRouter);
  app.use("/login", authRouter);
  app.use("/", (req, res) => {
    res.send("<h3>Api employees!</h3>");
  });
}

module.exports = route;
