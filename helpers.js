const stripCashtag = str => {
  return str[0] === '$' ? str.substring(1) : str;
};

module.exports = {
  stripCashtag,
};
