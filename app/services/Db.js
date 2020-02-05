import values from 'lodash/values';
import password from './password';

const Cryptr = require('cryptr');

export class PasswordInvalidError extends Error {
  constructor(message = '') {
    super(message);
    this.message = message;
    this.name = 'PasswordInvalidError';
  }
}

class Db {
  constructor(password) {
    this.password = password;
  }

  async clear() {
    return this.writeAll({});
  }

  async count() {
    const dbData = await this.getAll();
    return Object.keys(dbData).length;
  }

  async getAll() {
    const fs = require('fs');
    const util = require('util');
    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);

    const cryptr = new Cryptr(this.password);

    const dbPath = this.getPath();
    let dbData;
    try {
      const encryptedData = await readFile(dbPath);
      dbData = JSON.parse(cryptr.decrypt(encryptedData));
    } catch (error) {
      const errorStr = error.toString();
      if (/^Error: ENOENT:/.test(errorStr)) {
        // db didn't exist, creating...
        dbData = {};
        await writeFile(dbPath, JSON.stringify(dbData));
      } else {
        throw new PasswordInvalidError();
      }
    }

    return dbData;
  }

  async getBy(key, value) {
    const dbData = await this.getAll();
    return values(dbData).find(obj => obj[key] === value);
  }

  getPath() {
    const {
      remote: { app },
    } = require('electron');
    const { join } = require('path');
    return join(app.getPath('userData'), 'actionID.json');
  }

  async writeAll(dbData) {
    const fs = require('fs');
    const util = require('util');
    const writeFile = util.promisify(fs.writeFile);

    const cryptr = new Cryptr(this.password);
    const encryptedData = cryptr.encrypt(JSON.stringify(dbData));
    return writeFile(this.getPath(), encryptedData);
  }
}

export default Db;
