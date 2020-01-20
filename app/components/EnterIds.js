// @flow
import React from 'react';
import xlsx from 'xlsx';
import { Link } from 'react-router-dom';

import routes from '../routes';
import ValidationError from '../utils/ValidationError';
import { Tabs, TabTitle, TabContent } from './Tabs';

const {
  remote: { dialog },
} = require('electron');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const ACTION_ID_COLUMN_NAME = 'actionid';
const EMAIL_COLUMN_NAME = 'email';
const STRIPPED_EMAIL_COLUMN_NAME = 'strippedEmail';

const stripColName = n => n.replace(/[\s_-]/g, '').toLowerCase();

const stripEmail = e => {
  // Ignore dots and case in the non-domain part of the address.
  const parts = e.split('@');
  const localPart = parts.slice(0, -1).join('@');
  const domainPart = parts[parts.length - 1];
  return `${localPart.replace(/\./g, '').toLowerCase()}@${domainPart}`;
};

const sheetByIndex = (workbook, i) => {
  const sheetName = workbook.SheetNames[i];
  return workbook.Sheets[sheetName];
};

// const getColumns = sheet => {
//   const cellAddressPattern = /^([A-Z]+)([0-9]+)$/;
//   const cols = new Set();
//   for (const cellAddress of Object.keys(sheet)) {
//     if (cellAddressPattern.test(cellAddress)) {
//       const [, col] = cellAddressPattern.exec(cellAddress);
//       cols.add(col);
//     }
//   }
//   return Array.from(cols);
// };

// const getTableColumnNames = sheet => {
//   const letters = getColumns(sheet);
//   const cols = letters.map(l => {
//     const address = `${l}1`;
//     return sheet[address];
//   });
//   return letters.map(l => sheet[`${l}1`].v);
// };

const openSingleFile = async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.filePaths[0];
};

const readRecordsFromFile = (path, sheetIndex) => {
  const workbook = xlsx.readFile(path);
  const sheet = sheetByIndex(workbook, sheetIndex);
  const sheetData = xlsx.utils.sheet_to_json(sheet);

  const cols = Object.keys(sheetData[0]);
  let emailColumnName;
  let idColumnName;

  for (const colName of cols) {
    if (stripColName(colName) === EMAIL_COLUMN_NAME) {
      emailColumnName = colName;
    }
    if (stripColName(colName) === ACTION_ID_COLUMN_NAME) {
      idColumnName = colName;
    }
  }

  if (!emailColumnName || !idColumnName) {
    throw ValidationError('Could not find both email and action ID columns.');
  }

  return sheetData
    .filter(obj => obj[emailColumnName] && obj[idColumnName])
    .map(obj => ({
      [EMAIL_COLUMN_NAME]: obj[emailColumnName],
      [STRIPPED_EMAIL_COLUMN_NAME]: stripEmail(obj[emailColumnName]),
      [ACTION_ID_COLUMN_NAME]: obj[idColumnName],
    }));
};

const writeRecords = async records => {
  const dbPath = path.join(app.getPath('userData'), 'actionID.json');
  let dbData;
  try {
    const dbJson = await readFile(dbPath);
    dbData = JSON.parse(dbJson);
  } catch (error) {
    console.error("actionID.json didn't exist, creating...");
    console.error(error);
    dbData = {};
    await writeFile(dbPath, JSON.stringify(dbData));
  }

  const inserted = [];
  const updated = [];
  for (const r of records) {
    const key = r[STRIPPED_EMAIL_COLUMN_NAME];
    if (key in dbData) {
      if (dbData[key][ACTION_ID_COLUMN_NAME] !== r[ACTION_ID_COLUMN_NAME]) {
        updated.push(r);
      } // else data is a perfect match, don't report
    } else {
      inserted.push(r);
    }

    dbData[key] = r;
  }
  await writeFile(dbPath, JSON.stringify(dbData, null, '  '));

  return { inserted, updated };
};

type Props = {};

export default class Home extends React.Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      numRecordsInserted: undefined,
      numRecordsUpdated: undefined,
      warnings: [],
    };
  }

  openAndInsert = async () => {
    try {
      const path = await openSingleFile();
      const records = readRecordsFromFile(path, 0); // assumes first sheet
      const { inserted, updated } = await writeRecords(records);
      this.setState({
        numRecordsInserted: inserted.length,
        numRecordsUpdated: inserted.length,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        this.setState({
          warnings: [String(e)],
        });
      } else {
        throw e;
      }
    }
  };

  render() {
    const { numRecordsInserted, numRecordsUpdated } = this.state;
    return (
      <div data-tid="container">
        <h2>Enter Ids</h2>
        <Tabs>
          <TabContent title={<>Upload spreadsheet</>}>
            <p>
              The first sheet of the file should have a column called "email",
              or a column called "action ID", or both. Capitalization doesn't
              matter.
            </p>
            <button onClick={this.openAndInsert}>Open File</button>
          </TabContent>
          <TabContent title={<>Paste from spreadsheet</>}>
            <form>
              <p>
                Include column names when pasting. They may be either "email",
                "action ID", or both. Capitalization doesn't matter.
              </p>
              <textarea />
              <button type="submit">Submit</button>
            </form>
          </TabContent>
          <TabContent title={<>Enter individual</>}>
            <p>enter individuals</p>
          </TabContent>
        </Tabs>
        {numRecordsInserted !== undefined && (
          <p>New individuals recorded: {numRecordsInserted}</p>
        )}
        {numRecordsUpdated !== undefined && (
          <p>Individuals updated: {numRecordsUpdated}</p>
        )}
        <p>Warnings:</p>
      </div>
    );
  }
}
