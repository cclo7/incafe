const errorMap = {
  'NoMenuData': 'No menu data for the chosen date'
};

class Error {
  static getErrorMessage(error) {
    if (errorMap[error]) {
      return errorMap[error];
    }

    return 'Something unexpected happen';
  }
}

module.exports = Error;
