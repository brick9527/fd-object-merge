/**
 * 数组合并
 * @param {Array} target - 目标数组
 * @param {Array} source - 源数组
 * @param {any} options - 配置
 * @returns
 */
module.exports = function(target, source, options) {
  const { array = {} } = options;
  const { isConcat = true } = array;
  if (isConcat) {
    return [...target, ...source];
  }
  return [...target];
};
