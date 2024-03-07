/**
 * Init for app node js with express
 * @author SangDD
 */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = 3000;
const route = require("./routers");
const { connect, con } = require("./config/db");
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
// Route init
route(app);
// Database connection
connect(con);
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
