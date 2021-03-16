const getType = require('./libs/get_type');
const TYPE = require('./constants/type');
const tryParse = require('./libs/try_parse');
const { isMergeable } = require('./libs/check_type');
const arrayMerge = require('./libs/array_merge');
const objectMerge = require('./libs/object_merge');
const defaultConfig = require('./config/defaut');

/**
 * 深度合并两个变量
 * @param {any} target - 目标变量
 * @param {any} source - 源变量
 * @param {any} options - 配置
 * @returns
 */
module.exports = function(target, source, options = defaultConfig) {
  const targetType = getType(target);
  const sourceType = getType(source);

  let targetObj = target;
  let sourceObj = source;

  // target操作
  if (targetType === TYPE.STRING && target.startsWith('{')) {
    const temp = tryParse(target);
    if (getType(temp) === TYPE.OBJECT) {
      targetObj = temp;
    }
  }

  // source操作
  if (sourceType === TYPE.STRING && source.startsWith('{')) {
    const temp = tryParse(target);
    if (getType(temp) === TYPE.OBJECT) {
      sourceObj = temp;
    }
  }

  // 两者之一不是可合并的类型
  if (!isMergeable(targetObj) || !isMergeable(sourceObj)) {
    return targetObj;
  }

  // 两者都是可合并的类型
  // 两者都是Array
  if (getType(targetObj) === TYPE.ARRAY && getType(sourceObj) === TYPE.ARRAY) {
    return arrayMerge(targetObj, sourceObj, options);
  }

  // 两者都是Object
  if (getType(targetObj) === TYPE.OBJECT && getType(sourceObj) === TYPE.OBJECT) {
    // 对象合并
    return objectMerge(targetObj, sourceObj, options);
  }
};
