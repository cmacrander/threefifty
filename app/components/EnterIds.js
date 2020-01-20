// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';
import EnterIdsFile from './EnterIdsFile';
import EnterIdsPaste from './EnterIdsPaste';
import ErrorBoundary from './ErrorBoundary';
import jsonDataToRecords from '../utils/jsonDataToRecords';
import ValidationError from '../utils/ValidationError';
import {
  ACTION_ID_COLUMN_NAME,
  EMAIL_COLUMN_NAME,
  STRIPPED_EMAIL_COLUMN_NAME,
} from '../config';

import { Tabs, TabTitle, TabContent } from './Tabs';

const {
  remote: { app },
} = require('electron');

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

const writeRecords = async records => {
  const fs = require('fs');
  const path = require('path');
  const util = require('util');

  const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile);

  const dbPath = path.join(app.getPath('userData'), 'actionID.json');
  let dbData;
  try {
    const dbJson = await readFile(dbPath);
    dbData = JSON.parse(dbJson);
  } catch (error) {
    // db didn't exist, creating...
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

export default class EnterIds extends React.Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      numRecordsInserted: undefined,
      numRecordsUpdated: undefined,
      warnings: [],
    };
  }

  insertJsonData = async jsonData => {
    const records = jsonDataToRecords(jsonData);
    const { inserted, updated } = await writeRecords(records);
    this.setState({
      numRecordsInserted: inserted.length,
      numRecordsUpdated: updated.length,
    });
  };

  onValidationError = error => {
    this.setState({
      warnings: [String(e)],
    });
  };

  render() {
    const { numRecordsInserted, numRecordsUpdated, warnings } = this.state;
    return (
      <div data-tid="container">
        <h2>Enter Ids</h2>
        <Tabs>
          <TabContent title={<>Upload spreadsheet</>}>
            <EnterIdsFile
              onSubmit={this.insertJsonData}
              onValidationError={this.onValidationError}
            />
          </TabContent>
          <TabContent title={<>Paste from spreadsheet</>}>
            <EnterIdsPaste
              onSubmit={this.insertJsonData}
              onValidationError={this.onValidationError}
            />
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
        {warnings.length > 0 && (
          <>
            <p>Warnings:</p>
            <ul>
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
}
