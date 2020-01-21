import values from 'lodash/values';

const db = {
  async clear() {
    return this.writeAll({});
  },

  async count() {
    const dbData = await this.getAll();
    return Object.keys(dbData).length;
  },

  async getAll() {
    const fs = require('fs');
    const util = require('util');
    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);

    const dbPath = this.getPath();
    let dbData;
    try {
      const dbJson = await readFile(dbPath);
      dbData = JSON.parse(dbJson);
    } catch (error) {
      // db didn't exist, creating...
      dbData = {};
      await writeFile(dbPath, JSON.stringify(dbData));
    }

    return dbData;
  },

  async getBy(key, value) {
    const dbData = await this.getAll();
    return values(dbData).find(obj => obj[key] === value);
  },

  getPath() {
    const {
      remote: { app },
    } = require('electron');
    const { join } = require('path');
    return join(app.getPath('userData'), 'actionID.json');
  },

  async writeAll(dbData) {
    const fs = require('fs');
    const util = require('util');
    const writeFile = util.promisify(fs.writeFile);

    console.log('writeAll()', JSON.stringify(dbData, null, '  '));
    return writeFile(this.getPath(), JSON.stringify(dbData, null, '  '));
  },
};

export default db;
