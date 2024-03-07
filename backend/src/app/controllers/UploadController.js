const employeeService = require("../service/EmployeeService");
const mailService = require("../service/MailService");
const BillModel = require("../models/Bill");
const busboy = require("busboy");
const fs = require("fs");
const path = require("path");

/**
 * Controller for handling file uploads and invoice creation.
 * Provides methods for rendering the upload page and processing file uploads.
 *
 * @author SangDD
 */
class UploadController {
  /**
   * [HTTP-GET] /uploads
   * Renders the upload page.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  index(req, res) {
    res.send("<h1>Upload page!</h1>");
  }
  /**
   * [HTTP-POST] /uploads
   * Upload handler for processing file uploads and creating invoices.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   */
  upload(req, res) {
    const bb = busboy({ headers: req.headers });
    let bill = { files: [], oders: [] };
    let oder = {};
    bb.on("field", (name, val, info) => {
      let nameOder = employeeService.isOder(name);
      if (nameOder) {
        oder[nameOder] = val;
        if (nameOder === "price") {
          bill["oders"].push(oder);
          oder = {};
        }
      } else {
        bill[name] = val;
      }
    });
    // save files
    bb.on("file", (name, file, info) => {
      if (!info.filename) {
        file.resume();
        return;
      }
      const uploadDir = path.join(__dirname, "..", "..", "..", "uploads");
      const fname = info.filename || "";
      bill["files"].push(fname);
      const saveTo = path.join(uploadDir, fname);
      file.pipe(fs.createWriteStream(saveTo));
    });
    // create bill and sent mail
    bb.on("finish", async () => {
      try {
        const billModel = new BillModel(bill);
        await billModel.save();
        const emplTo = await employeeService.getEmployeeByID(
          bill["employeeID"]
        );
        const emplManager = await employeeService.getEmployeeManager(emplTo);
        // if (bill["sendMail"] && emplTo) {
        //   const contentMail = await mailService.createContentMail(bill, emplTo);
        //   // send mail to employee
        //   mailService.sendMailTo(emplTo, bill["employeeTo"], contentMail, bill);
        // }
        // // send mail to manager
        // if (emplManager && emplManager.id) {
        //   const contentMail = await mailService.createContentMail(
        //     bill,
        //     emplManager
        //   );
        //   mailService.sendMailTo(emplTo, emplManager["id"], contentMail, bill);
        // }
        res.status(200).send({
          code: "200",
          message: "Successfully uploaded",
        });
      } catch (err) {
        res.status(500).send({
          code: "200",
          message: "Error uploading file, and send mail!",
        });
      }
    });
    bb.on("close", () => {
      console.log("Busboy closed!.");
    });
    req.pipe(bb);
  }
}

module.exports = new UploadController();
