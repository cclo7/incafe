
let StringUtil = {
  capitalizeFirstLetters: (input) => {
    return input.split(' ').map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ').trim();
  }
};

module.exports = StringUtil;
