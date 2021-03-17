const getType = require('./get_type');
const TYPE = require('../constants/type');
const { isConstant, isMergeable } = require('./check_type');
const arrayMerge = require('./array_merge');

/**
 * 对象合并
 * @param {any} target - 目标对象
 * @param {any} source - 源对象
 * @param {any} options - 配置参数
 * @returns
 */
function objectMerge(target, source, options) {
  const { mixAttr = true } = options;
  const targetKeys = Object.keys(target);
  const sourceKeys = Object.keys(source);
  const keys = [...targetKeys];

  // 键名去重
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    if (targetKeys.includes(key)) {
      continue;
    }
    keys.push(key);
  }

  const finalObj = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isConstant(target[key])) {
      if (getType(target[key]) !== TYPE.UNDEFINED) {
        finalObj[key] = target[key];
        continue;
      }

      if (mixAttr) {
        finalObj[key] = source[key];
        if (isMergeable(source[key])) {
          finalObj[key] = JSON.parse(JSON.stringify(source[key]));
        }
        continue;
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
  }

  return finalObj;
};

module.exports = objectMerge;
