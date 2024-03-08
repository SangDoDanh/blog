const BlogModel = require("../models/Blog");
const { connect, con } = require("../../config/db");

class BlogRestController {
  /**
   * [HTTP-GET] /api/blogs
   * Retrieves all departments.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  index(req, res) {
    con.query("SELECT * FROM blog", (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
      res.status(200).json(rows);
    });
    con.end();
  }

  upload(req, res) {
    const blog = req.body;
    console.log(blog);
    connect(con);
    const sql = `INSERT INTO blog (first_name, last_name)
    VALUES (?, ?)`;
    con.query(sql, [blog.first_name, blog.last_name], (err, results) => {
      if (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(results);
        res.status(200).json({
          message: "Insert bllog successfully",
          staus: 200,
          blogId: results.insertId,
        });
      }
    });
    con.end();
  }
}

module.exports = new BlogRestController();
