/**
 * 尝试使用parse方法解析字符串。如果解析成功返回解析后的对象，否则返回null
 * @param {String} str - 所要解析的字符串
 * @returns
 */
module.exports = function(str) {
  let targetObj = str;
  try {
    targetObj = JSON.parse(str);
  } catch (err) {
    targetObj = str;
  }
  return targetObj;
};
