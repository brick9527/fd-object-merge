const TYPE = require('../constants/type');
const getType = require('./get_type');

const isMergeable = function(argv) {
  const type = getType(argv);
  return [TYPE.OBJECT, TYPE.ARRAY].includes(type);
};

const isConstant = function(argv) {
  const type = getType(argv);
  return [TYPE.BOOLEAN, TYPE.DATE, TYPE.ERROR, TYPE.NUMBER, TYPE.STRING, TYPE.UNDEFINED, TYPE.NULL, TYPE.REGEXP, TYPE.FUNCTION].includes(type);
};

module.exports = {
  isMergeable,
  isConstant,
};
