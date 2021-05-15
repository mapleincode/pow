/**
 * @Author: maple
 * @Date: 2020-11-18 11:43:40
 * @LastEditors: maple
 * @LastEditTime: 2021-02-18 17:56:14
 */
const T = require('toshihiko');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'model');

const mysqls = config.mysql;
const dbNames = Object.keys(mysqls);

const chars = 'abcdefghijklmnopgrstuvwxyz'.split('');
const charMap = {};
const lowerCharMap = {};
for (const c of chars) {
  charMap[c.toUpperCase()] = c;
  lowerCharMap[c] = c;
}

function getLowerName (name = '') {
  let result = '';
  for (let i = 0; i < name.length; i++) {
    const c = name[i];
    const lastC = name[i - 1];
    const nextC = name[i + 1];
    if (charMap[c] && (lowerCharMap[lastC] ||
            ((charMap[lastC]) && lowerCharMap[nextC]))) {
      result += '_';
      result += charMap[c];
      continue;
    }
    result += c.toLowerCase();
  }

  return result;
}

const qdefine = function (table, items, options = {}) {
  const configs = [];

  const { setPrimaryKey = true } = options;

  let primaryKeySet = !setPrimaryKey;

  for (let item of items) {
    if (typeof item === 'string') {
      item = item.split(',').map(item => item.trim());
    }

    const config = {};

    // 设置 primary key
    if (!primaryKeySet) {
      config.primaryKey = true;
      config.allowNull = true;
      primaryKeySet = true;
    }

    // 全局 allowNull
    if (options.allowNull) {
      if (!config.primaryKey) {
        config.allowNull = true;
      }
    }

    const name = item.shift();

    if (typeof name === 'string') {
      const lowerName = getLowerName(name);

      if (lowerName !== name) {
        config.column = lowerName;
      }
      config.name = name;
    } else if (Array.isArray(name) && name.length) {
      config.name = name[0];
      config.column = name[1] || undefined;
    }

    if (item.length === 0) {
      configs.push(config);
      continue;
    }

    let type = item.shift();
    const TYPE = T.Type;
    if (typeof type === 'string') {
      if (type === 's') type = 'String';
      if (type === 'i') type = 'Integer';
      if (type === 'f') type = 'Float';
      if (type === 'd') type = 'Datetime';
      if (type === 'b') type = 'Boolean';

      if (TYPE[type]) {
        config.type = TYPE[type];
      }
    } else if (type) {
      config.type = type;
    }

    if (item.length === 0) {
      configs.push(config);
      continue;
    }

    let allowNull = item.shift();
    let defaultValue;

    // 判定 Boolean 下 true 为默认值优先
    if (type === 'Boolean' && (
      typeof allowNull === 'boolean' ||
      allowNull === 'true' ||
      allowNull === 'false'
    )) {
      allowNull = allowNull ? (allowNull !== 'false') : false;
      config.defaultValue = defaultValue = allowNull;
    } else {
      if (allowNull === '$t' || allowNull === 'true' || allowNull === true) {
        config.allowNull = allowNull = true;
      } else if (allowNull === '$f' || allowNull === false || allowNull === false) {
        config.allowNull = allowNull = false;
      } else {
        config.defaultValue = defaultValue = allowNull;
      }
    }

    // if (item.length === 0) {
    //   configs.push(config);
    //   continue;
    // }

    if (defaultValue === undefined) {
      defaultValue = item.shift();
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      item.unshift(defaultValue);
    } else if (defaultValue !== undefined) {
      // 根据类型，对 defaultValue 做转换

      if (type === 'Integer') {
        defaultValue = parseInt(defaultValue);
      } else if (type === 'Float') {
        defaultValue = parseFloat(defaultValue);
      } else if (type === 'Boolean') {
        defaultValue = allowNull ? (allowNull !== 'false') : false;
      }

      config.defaultValue = defaultValue;
    }

    if (item.length === 0) {
      configs.push(config);
      continue;
    }

    const otherConfig = item.shift();
    if (typeof otherConfig === 'object') {
      Object.assign(config, otherConfig);
    }

    configs.push(config);
  }

  const model = this._define(table, configs);
  if (MODLE_MAP[table]) {
    throw new Error(`table: ${table} 重复注册`);
  }
  MODLE_MAP[table] = model;
  return model;
};

const MODLE_MAP = {};
const DB_MAP = {};

for (const name of dbNames) {
  const dbConfig = mysqls[name];
  dbConfig.database = name;
  const db = DB_MAP[name] = new T.Toshihiko('mysql', dbConfig);

  db._define = db.define;
  db.qdefine = qdefine;
  db.define = function (table, ...params) {
    const model = this._define(table, ...params);
    if (MODLE_MAP[table]) {
      throw new Error(`table: ${table} 重复注册`);
    }
    MODLE_MAP[table] = model;
    return model;
  };
  db.TYPE = T.Type;
}
// const ddns = new T.Toshihiko('mysql', mysqls.ddns);
// const arku = new T.Toshihiko('mysql', mysqls.arku);

// arku.qdefine = qdefine;
// arku.TYPE = T.Type;
// arku._define = arku.define;
// arku.define = function (table, ...params) {
//   const model = this._define(table, ...params);
//   if (MODLE_MAP[table]) {
//     throw new Error(`table: ${table} 重复注册`);
//   }
//   MODLE_MAP[table] = model;
//   return model;
// };

module.exports = {
  get: function (name) {
    return DB_MAP[name] || null;
  },
  modelGet: function (table) {
    return MODLE_MAP[table];
  }
};

const dirs = fs.readdirSync(root);
for (const file of dirs) {
  if (file[0] === '.') continue;
  if (file.indexOf('.js') > -1) {
    require(path.join(root, file));
    continue;
  }

  const subRoot = path.join(root, file);
  const subDirs = fs.readdirSync(subRoot);
  for (const file of subDirs) {
    if (file[0] === '.') continue;
    if (file.indexOf('.js') > -1) {
      require(path.join(subRoot, file));
      continue;
    }
  }
}
