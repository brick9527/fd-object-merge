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
function objectMerge(target = {}, source = {}, options = {}) {
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
    const targetType = getType(target[key]);
    const sourceType = getType(source[key]);
    if (isConstant(target[key])) {
      if (targetType !== TYPE.UNDEFINED) {
        finalObj[key] = target[key];
        continue;
      }

      // target[key] = Undefined
      if (mixAttr) {
        finalObj[key] = source[key];

        if (sourceType === TYPE.ARRAY) {
          finalObj[key] = JSON.parse(JSON.stringify(source[key]));
          continue;
        }

        if (sourceType === TYPE.OBJECT) {
          finalObj[key] = Object.assign({}, source[key]);
          const sourceKeys = Object.keys(source[key]);
          for (let i = 0; i < sourceKeys.length; i++) {
            const sourceKey = sourceKeys[i];
            if (isMergeable(source[key][sourceKey])) {
              finalObj[key][sourceKey] = objectMerge({}, source[key][sourceKey], options);
            }
          }
          continue;
        }

        if (sourceType === TYPE.SYMBOL) {
          finalObj[key] = Symbol(source[key].description);
          continue;
        }
      }
    }

    // targetType = [Object | Array]
    if (targetType === TYPE.OBJECT && sourceType === TYPE.OBJECT) {
      finalObj[key] = objectMerge(target[key], source[key], options);
      continue;
    }

    if (targetType === TYPE.ARRAY && sourceType === TYPE.ARRAY) {
      finalObj[key] = arrayMerge(target[key], source[key], options);
      continue;
    }

    if (isMergeable(target[key])) {
      if (targetType === TYPE.ARRAY) {
        finalObj[key] = JSON.parse(JSON.stringify(target[key]));
        continue;
      }

      if (targetType === TYPE.OBJECT) {
        finalObj[key] = Object.assign({}, target[key]);
        const targetKeys = Object.keys(target[key]);
        for (let i = 0; i < targetKeys.length; i++) {
          const targetKey = targetKeys[i];
          if (isMergeable(target[key][targetKey])) {
            finalObj[key][targetKey] = objectMerge({}, target[key][targetKey], options);
          }
        }
      }
      continue;
    }
  }

  return finalObj;
};

module.exports = objectMerge;
