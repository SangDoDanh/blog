const EmployeeModel = require("../models/Employee");
const DepartmentModel = require("../models/Department");
const commonService = require("../service/comcon/CommonService");
const nodemailer = require("nodemailer");
const CommonService = require("../service/comcon/CommonService");
const HtmlService = require("../service/comcon/HtmlService");
/**
 * calss handler sent email to employee
 * @author SangDD
 */
class MaiiService {
  // sendMail to
  async sendMailTo(emplFrom, emplIDTo, contentHtml, bill) {
    if (!emplIDTo || !emplFrom) {
      console.log("Employee is invalid");
      return false;
    }
    const emplTO = await EmployeeModel.findOne({ id: emplIDTo });
    if (!emplTO) {
      console.log("Find not found employee to, with id " + emplIDTo);
      return false;
    }

    //mailtrap
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: `${process.env.MAIL_TRAP_USER}`,
        pass: `${process.env.MAIL_TRAP_PASS}`,
      },
    });

    // luvina.net
    // const transporter = nodemailer.createTransport({
    //   host: "mail.luvina.net",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "example@luvina.net",
    //     pass: "my-password",
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });
    const mailOptions = {
      from: `${emplFrom.email}`,
      to: `${emplTO.email}`,
      subject: `[${bill.fullName}] - ${
        bill.template
      } - ${commonService.getCurrentDateTime()}`,
      text: `
            Deare ${emplTO.first_name} ${emplTO.last_name}! 
            Hello, There is a new bill just created by [${emplFrom.first_name}]
            `,
      html: contentHtml,
      attachments: [
        {
          filename: "bill.json",
          content: JSON.stringify(bill),
          encoding: "utf-8",
        },
      ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Email sent>>>>>>>>>>>>>>>>:", info.response);
      }
    });
  }

  async createContentMail(bill, emplTo) {
    const department = await DepartmentModel.findOne({ id: bill.department });
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Apply_Form | Create Bill</title>
        <style>
          table,
          th,
          td {
            border: 1px solid white;
            border-collapse: collapse;
          }
          th,
          td {
            background-color: #96d4d4;
            padding: 8px 12px;
          }
        </style>
      </head>
      <body>
        <div class="main">
          <div class="hello">
            <h2>Hi, ${emplTo.first_name} ${emplTo.last_name}!</h2>
          </div>
          <div class="contetn">
            <p>There is a new bill just created by [${bill.fullName}]</p>
            <div class="info">
              <p>Information creator.</p>
              <ul>
                <li>Full name: ${bill.fullName}</li>
                <li>ID: ${bill.employeeID}</li>
                <li>Department: ${department.name}</li>
              </ul>
              <hr />
              <p>Information basic</p>
              <ul>
                <li>Type: ${CommonService.getType(bill.type)}</li>
                <li>Description: ${bill.description}</li>
              </ul>
              <hr />
              <p>Information Order</p>
              <table id="table-order">
                <thead>
                  <th>#</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price / 1</th>
                </thead>
                <tbody>
                  ${HtmlService.renderOrderTable(bill.oders)}
                </tbody>
              </table>
              <hr />
              <p>Information Files</p>
              <ul>
                ${HtmlService.renderFiles(bill.files)}
              </ul>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;
  }
}
module.exports = new MaiiService();
