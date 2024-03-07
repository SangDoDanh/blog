class CommonService {
  getType(typeId) {
    let result = "";
    switch (typeId) {
      case "1":
        result = "Stationery";
        break;
      case "2":
        result = "Purchase equipment periodically";
        break;
      case "3":
        result = "Quarterly summary";
        break;
      case "4":
        result = "Year-end party";
        break;
      case "5":
        result = "International women's party";
        break;
      case "6":
        result = "Christmas party";
        break;
      case "7":
        result = "Welcome the customers";
        break;
      case "8":
        result = "Welcome new employees";
        break;
    }
    return result;
  }
  getCurrentDateTime() {
    function padZero(num) {
      return (num < 10 ? "0" : "") + num;
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const formattedDateTime =
      year + "/" + month + "/" + day + " - " + hours + ":" + minutes;

    return formattedDateTime;
  }
}

module.exports = new CommonService();
