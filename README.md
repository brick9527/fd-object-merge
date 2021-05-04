[![Build Status](https://www.travis-ci.org/brick9527/object-merge.svg?branch=master)](https://www.travis-ci.org/brick9527/object-merge)
[![codecov](https://codecov.io/gh/brick9527/object-merge/branch/master/graph/badge.svg?token=ZKNHWFUNIS)](https://codecov.io/gh/brick9527/object-merge)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/brick9527/object-merge)
![npm bundle size](https://img.shields.io/bundlephobia/min/fd-object-merge)
![NPM](https://img.shields.io/npm/l/fd-object-merge)
![npm](https://img.shields.io/npm/v/fd-object-merge)
# 简介（Summary）

`Object Merge`是一个用于JS对象合并的工具库，包含数组和对象的合并，实现对象间的深拷贝。

尤其是用于处理标准配置与本地配置的合并。

支持Node版本：>= 12.X
# 特性（Feature）

- 轻量级
- 无依赖
- 纯JS实现

# 安装（Install）

- `npm`安装

```bash
npm i fd-object-merge --save
```

- `cnpm`安装

```bash
cnpm i fd-object-merge --save
```

# API

## objectMerge

### 类型

`Function`
### 参数

|参数名|类型|必须|说明|
|-|-|-|-|
|targetObj|any|是|目标对象|
|sourceObj|any|否|源对象|
|options|any|否|配置项|
|options.array.isConcat|Boolean|否|若是数组（或对象属性为数组）时，数组是否进行合并。`true`：合并；`false`：不合并|
|options.mixAttr|Boolean|否|若`targetObj`与`sourceObj`属性存在不一致的情况时，是否进行属性合并。`true`：合并；`false`：不合并|


# 使用（Usage）

## 默认配置示例

```js
const objectMerge = require('fd-object-merge');

const targetObj = {
  name: 'zhangsan',
  age: 18
};

const sourceObj = {
  name: 'lisi',
  weight: 140,
};

const result = objectMerge(targetObj, sourceObj);

console.log(result);

/**
 * result = {
 *   name: 'zhangsan',
 *   age: 18,
 *   weight: 140
 * }
 */
```

## 数组不合并示例

```js
const objectMerge = require('fd-object-merge');

const targetObj = {
  name: 'zhangsan',
  age: 18,
  class: ['Math', 'Chinese'],
};

const sourceObj = {
  name: 'lisi',
  weight: 140,
  class: ['English']
};

const options = {
  array: {
    isConcat: false, // 数组不合并
  }
};

const result = objectMerge(targetObj, sourceObj, options);

console.log(result);

/**
 * result = {
 *   name: 'zhangsan',
 *   age: 18,
 *   weight: 140,
 *   class: ['Math', 'Chinese']
 * }
 */
```

## 属性不合并示例

```js
const objectMerge = require('fd-object-merge');

const targetObj = {
  name: 'zhangsan',
  age: 18,
  class: ['Math', 'Chinese'],
};

const sourceObj = {
  name: 'lisi',
  weight: 140,
  class: ['English']
};

const options = {
  mixAttr: false, // 属性不合并
};

const result = objectMerge(targetObj, sourceObj, options);

console.log(result);

/**
 * result = {
 *   name: 'zhangsan',
 *   age: 18,
 *   class: ['Math', 'Chinese', 'English']
 * }
 */
```
