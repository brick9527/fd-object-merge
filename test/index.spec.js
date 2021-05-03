/* eslint-disable no-undef */
const assert = require('assert').strict;

const objectMerge = require('../index');
const TYPE = require('../constants/type');
const { isConstant } = require('../libs/check_type');
const getType = require('../libs/get_type');

describe('集成测试，常量合并', () => {
  const TYPE_VALUE = {
    [TYPE.NUMBER]: 999,
    [TYPE.STRING]: '123',
    [TYPE.BOOLEAN]: true,
    [TYPE.ARRAY]: [1, 2, 3],
    [TYPE.OBJECT]: { name: 'zhangsan' },
    [TYPE.FUNCTION]: function() { console.log('1'); },
    [TYPE.UNDEFINED]: undefined,
    [TYPE.NULL]: null,
    [TYPE.DATE]: new Date(),
    [TYPE.REGEXP]: /abc/g,
    [TYPE.ERROR]: new Error('my err'),
  };

  const keys = Object.keys(TYPE_VALUE);

  for (let i = 0; i < keys.length; i++) {
    const targetKey = keys[i];
    const target = TYPE_VALUE[targetKey];
    if (!isConstant(target)) {
      continue;
    }

    for (let j = 0; j < keys.length; j++) {
      const sourceKey = keys[j];
      const source = TYPE_VALUE[sourceKey];
      if (!isConstant(source)) {
        continue;
      }

      it(`${getType(target)}+${getType(source)}`, () => {
        const result = objectMerge(target, source);

        assert.deepStrictEqual(target, result);
      });
    }
  }

  it('Infinite常量合并', () => {
    const targetObj = {};

    const sourceObj = {
      num: Infinity,
    };

    const result = objectMerge(targetObj, sourceObj);

    assert.deepStrictEqual(result.num, Infinity);
  });

  it('包含Infinite的对象合并', () => {
    const targetObj = {};

    const sourceObj = {
      numInfo: {
        type: 'number',
        value: Infinity,
      },
    };

    const result = objectMerge(targetObj, sourceObj);

    assert.deepStrictEqual(result.numInfo.value, Infinity);
  });
});

describe('集成测试，默认配置', () => {
  it('两个数组合并', () => {
    const target = [1, 2, 3];
    const source = [4, 5, 6];

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.toString(), [...target, ...source].toString());
  });

  it('两个对象合并', () => {
    it('属性一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        name: '李四',
      };

      const result = objectMerge(target, source);

      assert.deepStrictEqual(result.name, target.name);
    });

    it('属性不一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        age: 18,
      };

      const result = objectMerge(target, source);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.age, source.age);
    });

    it('属性部分不一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        name: '李四',
        age: 18,
      };

      const result = objectMerge(target, source);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.age, source.age);
    });

    it('带有数组', () => {
      const target = {
        name: 'zhangsan',
        class: ['chinese', 'english'],
      };

      const source = {
        name: 'lisi',
        class: ['math'],
      };

      const result = objectMerge(target, source);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.class.toString(), [...target.class, ...source.class].toString());
    });
  });

  it('两个可以转为JSON的字符串', () => {
    const targetObj = {
      name: 'zhangsan',
    };
    const sourceObj = {
      age: 18,
    };
    const target = JSON.stringify(targetObj);

    const source = JSON.stringify(sourceObj);

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.name, targetObj.name);
    assert.deepStrictEqual(result.age, sourceObj.age);
  });

  it('两个不能转换为JSON的字符串', () => {
    const target = '{2141';
    const source = '{abc';

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result, target);
  });

  it('深对象合并', () => {
    const target = {
      name: 'zhangsan',
      info: {
        weight: 120,
        height: 178,
        hobby: {
          code: 5,
          games: 4,
        },
        class: ['chinese', 'english'],
      },
      ext: {
        girlfriend: true,
      },
    };
    const source = {
      name: 'lisi',
      info: {
        color: 'black',
        hobby: {
          football: 9,
        },
        class: ['math', 'english'],
      },
      clothes: {
        nick: true,
      },
    };

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.name, target.name);
    assert.deepStrictEqual(result.info.weight, target.info.weight);
    assert.deepStrictEqual(result.info.height, target.info.height);
    assert.deepStrictEqual(result.info.color, source.info.color);
    assert.deepStrictEqual(result.info.hobby.code, target.info.hobby.code);
    assert.deepStrictEqual(result.info.hobby.games, target.info.hobby.games);
    assert.deepStrictEqual(result.info.hobby.football, source.info.hobby.football);
    assert.deepStrictEqual(result.ext.girlfriend, target.ext.girlfriend);
    assert.deepStrictEqual(result.clothes.nick, source.clothes.nick);
    assert.deepStrictEqual(result.info.class.toString(), [...target.info.class, ...source.info.class].toString());
  });
});

describe('集成测试，数组不合并', () => {
  const options = {
    array: {
      isConcat: false,
    },
  };

  it('两个数组合并', () => {
    const target = [1, 2, 3];
    const source = [4, 5, 6];

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result.toString(), [...target].toString());
  });

  it('两个对象合并', () => {
    it('属性一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        name: '李四',
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
    });

    it('属性不一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        age: 18,
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.age, source.age);
    });

    it('属性部分不一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        name: '李四',
        age: 18,
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.age, source.age);
    });

    it('带有数组', () => {
      const target = {
        name: 'zhangsan',
        class: ['chinese', 'english'],
      };

      const source = {
        name: 'lisi',
        class: ['math'],
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.class.toString(), target.class.toString());
    });
  });

  it('两个可以转为JSON的字符串', () => {
    const targetObj = {
      name: 'zhangsan',
    };
    const sourceObj = {
      age: 18,
    };
    const target = JSON.stringify(targetObj);

    const source = JSON.stringify(sourceObj);

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result.name, targetObj.name);
    assert.deepStrictEqual(result.age, sourceObj.age);
  });

  it('两个不能转换为JSON的字符串', () => {
    const target = '{2141';
    const source = '{abc';

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result, target);
  });

  it('深对象合并', () => {
    const target = {
      name: 'zhangsan',
      info: {
        weight: 120,
        height: 178,
        hobby: {
          code: 5,
          games: 4,
        },
        class: ['chinese', 'english'],
      },
      ext: {
        girlfriend: true,
      },
    };
    const source = {
      name: 'lisi',
      info: {
        color: 'black',
        hobby: {
          football: 9,
        },
        class: ['math', 'english'],
      },
      clothes: {
        nick: true,
      },
    };

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result.name, target.name);
    assert.deepStrictEqual(result.info.weight, target.info.weight);
    assert.deepStrictEqual(result.info.height, target.info.height);
    assert.deepStrictEqual(result.info.color, source.info.color);
    assert.deepStrictEqual(result.info.hobby.code, target.info.hobby.code);
    assert.deepStrictEqual(result.info.hobby.games, target.info.hobby.games);
    assert.deepStrictEqual(result.info.hobby.football, source.info.hobby.football);
    assert.deepStrictEqual(result.ext.girlfriend, target.ext.girlfriend);
    assert.deepStrictEqual(result.clothes.nick, source.clothes.nick);
    assert.deepStrictEqual(result.info.class.toString(), target.info.class.toString());
  });
});

describe('集成测试，超出target属性范围的不合并', () => {
  const options = {
    mixAttr: false,
  };

  it('两个数组合并', () => {
    const target = [1, 2, 3];
    const source = [4, 5, 6];

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result.toString(), [...target, ...source].toString());
  });

  it('两个对象合并', () => {
    it('属性一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        name: '李四',
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
    });

    it('属性不一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        age: 18,
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.age, undefined);
    });

    it('属性部分不一致', () => {
      const target = {
        name: '张三',
      };
      const source = {
        name: '李四',
        age: 18,
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.age, undefined);
    });

    it('带有数组', () => {
      const target = {
        name: 'zhangsan',
        class: ['chinese', 'english'],
      };

      const source = {
        name: 'lisi',
        class: ['math'],
      };

      const result = objectMerge(target, source, options);

      assert.deepStrictEqual(result.name, target.name);
      assert.deepStrictEqual(result.class.toString(), [...target.class, ...source.class].toString());
    });
  });

  it('两个可以转为JSON的字符串', () => {
    const targetObj = {
      name: 'zhangsan',
    };
    const sourceObj = {
      age: 18,
    };
    const target = JSON.stringify(targetObj);

    const source = JSON.stringify(sourceObj);

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result.name, targetObj.name);
    assert.deepStrictEqual(result.age, undefined);
  });

  it('两个不能转换为JSON的字符串', () => {
    const target = '{2141';
    const source = '{abc';

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result, target);
  });

  it('深对象合并', () => {
    const target = {
      name: 'zhangsan',
      info: {
        weight: 120,
        height: 178,
        hobby: {
          code: 5,
          games: 4,
        },
        class: ['chinese', 'english'],
      },
      ext: {
        girlfriend: true,
      },
    };
    const source = {
      name: 'lisi',
      info: {
        color: 'black',
        hobby: {
          football: 9,
        },
        class: ['math', 'english'],
      },
      clothes: {
        nick: true,
      },
    };

    const result = objectMerge(target, source, options);

    assert.deepStrictEqual(result.name, target.name);
    assert.deepStrictEqual(result.info.weight, target.info.weight);
    assert.deepStrictEqual(result.info.height, target.info.height);
    assert.deepStrictEqual(result.info.color, undefined);
    assert.deepStrictEqual(result.info.hobby.code, target.info.hobby.code);
    assert.deepStrictEqual(result.info.hobby.games, target.info.hobby.games);
    assert.deepStrictEqual(result.info.hobby.football, undefined);
    assert.deepStrictEqual(result.ext.girlfriend, target.ext.girlfriend);
    assert.deepStrictEqual(result.clothes, undefined);
    assert.deepStrictEqual(result.info.class.toString(), [...target.info.class, ...source.info.class].toString());
  });
});

describe('集成测试补充', () => {
  it('target属性为undefined，source属性为数组', () => {
    const target = {};
    const source = {
      a: [4, 5, 6],
    };

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.a.toString(), source.a.toString());
  });

  it('target属性为undefined，source属性的子属性为对象', () => {
    const target = {};
    const source = {
      a: {
        child: 'hello world',
        info: {
          hobby: ['movie'],
        },
      },
    };

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.a.child, source.a.child);
  });

  it('target属性为undefined，source属性为Symbol', () => {
    const target = {};
    const source = {
      a: Symbol('123'),
    };

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.a.toString(), source.a.toString());
    assert.deepStrictEqual(result.a.description, source.a.description);
  });

  it('target属性为Array，source属性为任意', () => {
    const target = {
      a: [1, 2, 3],
    };
    const source = {
      a: Symbol('123'),
    };

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.a.toString(), target.a.toString());
  });

  it('target属性的子属性为object，source属性为任意', () => {
    const target = {
      a: {
        info: {
          hobby: ['basketball'],
        },
      },
    };
    const source = {
      a: Symbol('123'),
    };

    const result = objectMerge(target, source);

    assert.deepStrictEqual(result.a.info.hobby.toString(), target.a.info.hobby.toString());
  });
});
