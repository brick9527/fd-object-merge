/**
 * 获取两个数组合并后的唯一值的数组
 * @param {Array<>} targetArr - 目标数组，以该数组值为主
 * @param {Array<>} sourceArr - 源数组，以该数组值为辅
 * @returns
 */
function getUniqArray(targetArr, sourceArr) {
  const arr = [...targetArr];
  for (let i = 0; i < sourceArr.length; i++) {
    const key = sourceArr[i];
    if (arr.includes(key)) {
      continue;
    }
    arr.push(key);
  }

  return arr;
}

module.exports = {
  getUniqArray,
};
