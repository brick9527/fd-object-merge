/**
 * 获取变量的类型
 * @param {any} variable - 所要获取类型的变量
 * @returns
 */
module.exports = function(variable) {
  const type = Object.prototype.toString.call(variable);

  return type.slice(8, -1);
};
