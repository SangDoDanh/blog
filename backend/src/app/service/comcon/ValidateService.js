class ValidateService {
  isDateValid(deadline, format = "YYYY/MM/DD") {
    if (!deadline || !format) return false;
    let dateRegex;
    format = format.trim().toUpperCase();
    switch (format) {
      case "YYYY/MM/DD":
      case "YYYY-MM-DD":
        dateRegex =
          /^(?:(?:(?:19|20)\d\d)[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12][0-9]|3[01])|(?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12][0-9]|3[01])[-/](?:19|20)\d\d)$/;
        break;
      case "DD/MM/YYYY":
      case "DD-MM-YYYY":
        dateRegex =
          /^(?:0[1-9]|[12][0-9]|3[01])[-/](?:0[1-9]|1[0-2])[-/](?:(?:19|20)\d\d)$/;
        break;
    }

    return dateRegex.test(deadline);
  }

  isRangeLength(value, min, max) {
    if (!value) return false;
    return value.length >= min && value.length <= max;
  }

  isRequired(value) {
    return !!value && !!value.trim();
  }
}

module.exports = new ValidateService();
