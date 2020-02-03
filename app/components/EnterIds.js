// @flow
import React from 'react';

import Button from './Button';
import EnterIdsFile from './EnterIdsFile';
import EnterIdsPaste from './EnterIdsPaste';
import EnterIdSingle from './EnterIdSingle';
import db from '../services/db';
import jsonDataToRecords from '../utils/jsonDataToRecords';
import { ACTION_ID_COLUMN_NAME, STRIPPED_EMAIL_COLUMN_NAME } from '../config';

import { Tabs, TabTitle, TabContent } from './Tabs';

const writeRecords = async records => {
  const dbData = await db.getAll();

  const inserted = [];
  const updated = [];
  for (const r of records) {
    const key = r[ACTION_ID_COLUMN_NAME];
    if (key in dbData) {
      const existingValue = dbData[key][STRIPPED_EMAIL_COLUMN_NAME];
      if (existingValue !== r[STRIPPED_EMAIL_COLUMN_NAME]) {
        updated.push(r);
      } // else data is a perfect match, don't report
    } else {
      inserted.push(r);
    }

    // @todo: index both by email and action id, right now we can have multiple
    // emails with the same action id

    dbData[key] = r;
  }
  await db.writeAll(dbData);
  const numRecordsTotal = await db.count();

  return { inserted, updated, numRecordsTotal };
};

type Props = {};

export default class EnterIds extends React.Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      numRecordsInserted: undefined,
      numRecordsTotal: 0,
      numRecordsUpdated: undefined,
      warnings: [],
    };
  }

  async componentDidMount() {
    const numRecordsTotal = await db.count();
    this.setState({ numRecordsTotal });
  }

  clearDatabase = async () => {
    const { numRecordsTotal } = this.state;
    const msg =
      `Are you sure you want to delete all ${numRecordsTotal} records in the ` +
      `database?`;
    if (confirm(msg)) {
      await db.clear();
      this.setState({ numRecordsTotal: 0 });
      this.clearMessages();
    }
  };

  clearMessages = () =>
    this.setState({
      numRecordsInserted: undefined,
      numRecordsUpdated: undefined,
      warnings: [],
    });

  insertJsonData = async jsonData => {
    const records = jsonDataToRecords(jsonData);
    const { inserted, updated, numRecordsTotal } = await writeRecords(records);
    this.setState({
      numRecordsInserted: inserted.length,
      numRecordsUpdated: updated.length,
      numRecordsTotal,
    });
  };

  onValidationError = error => {
    this.setState({
      warnings: [String(e)],
    });
  };

  render() {
    const {
      numRecordsInserted,
      numRecordsTotal,
      numRecordsUpdated,
      warnings,
    } = this.state;
    return (
      <div data-tid="container">
        <h1>Enter Ids</h1>
        <p>Current database contains {numRecordsTotal} records.</p>
        <p>
          <Button onClick={this.clearDatabase}>Clear database</Button>
        </p>
        <Tabs onChange={this.clearMessages}>
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
            <EnterIdSingle
              onSubmit={this.insertJsonData}
              onValidationError={this.onValidationError}
            />
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
