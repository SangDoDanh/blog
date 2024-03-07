/**
 * Provides methods to help manipulate html tags, such as creating new ones,
 *  binding data to html tags
 * @author SangDD
 */
class HtmlService {
  /**
   *Create html tr tags as strings.

   * @param {*} oders is an array with orders:{name: string, quantity: number, price: number}
   * @returnsa series of html tr tags, with the contents of the fields in the order object,
   *  respectively: name, quantity, price.
   */
  renderOrderTable(oders) {
    let trHtml = "";
    for (let i = 0; i < oders.length; i++) {
      let oder = oders[i];
      trHtml += `
            <tr>
              <td>${i + 1}</td>
              <td>${oder.name}</td>
              <td>${oder.quantity}</td>
              <td>${oder.price}</td>
            </tr>
          `;
    }
    return trHtml;
  }

  /**
   * Create html li tags as strings.
   *
   * @param {*} files is an array with files:{name: string}
   * @returns a string consisting of li tags, the content of the li tags are file names.
   */
  renderFiles(files) {
    let liHtml = "";
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      liHtml += `
              <li>${file}</li>
          `;
    }
    return liHtml;
  }
}

module.exports = new HtmlService();
