const getType = require('./get_type');
const TYPE = require('../constants/type');
const { isConstant, isMergeable } = require('./check_type');
const arrayMerge = require('./array_merge');

function objectMerge(target, source, options) {
  const { mixAttr = true } = options;
  const targetKeys = Object.keys(target);
  const sourceKeys = Object.keys(source);
  const keys = [...targetKeys, ...sourceKeys];
  console.log('keys = ', keys);
  const finalObj = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(target[key], isConstant(target[key]));
    if (isConstant(target[key])) {
      console.log('1');
      if (getType(target[key]) !== TYPE.UNDEFINED) {
        console.log('12');
        finalObj[key] = target[key];
        continue;
      }

      if (mixAttr) {
        console.log('13');

        finalObj[key] = source[key];
      }
    }

    if (getType(target[key]) === TYPE.OBJECT && getType(source[key]) === TYPE.OBJECT) {
      finalObj[key] = objectMerge(target[key], source[key], options);
      continue;
    }

    if (getType(target[key]) === TYPE.ARRAY && getType(source[key]) === TYPE.ARRAY) {
      finalObj[key] = arrayMerge(target[key], source[key], options);
      continue;
    }

    if (isMergeable(target[key])) {
      finalObj[key] = JSON.parse(JSON.stringify(target[key]));
      continue;
    }

    if (isMergeable(source[key])) {
      finalObj[key] = JSON.parse(JSON.stringify(source[key]));
      continue;
    }
  }

  return finalObj;
};

module.exports = objectMerge;
