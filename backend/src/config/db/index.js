const mysql = require("mysql");

const con = mysql.createConnection({
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASS}`,
});

function connect(con) {
  con.connect(function (err) {
    if (err) {
      console.log("Failed to connect!");
    } else {
      console.log("Connected!");
    }
  });
}
module.exports = { connect, con };
