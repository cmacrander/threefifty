// @flow
import React, { Component } from 'react';
import xlsx from 'xlsx';
import { connect } from 'react-redux';

import Button from './Button';
import Input from './Input';
import Db from '../services/Db';
import getMatchingColumnNames from '../utils/getMatchingColumnNames';
import openSingleFilePath from '../utils/openSingleFilePath';
import readJsonFromFile from '../utils/readJsonFromFile';
import { ACTION_ID_COLUMN_NAME, EMAIL_COLUMN_NAME } from '../config';

type Props = {};

class AddToFile extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      selectedFilePath: '',
      success: '',
      warnings: [],
    };
  }

  handleClickOpen = async () => {
    const path = await openSingleFilePath();
    this.setState({ selectedFilePath: path });
  };

  handleAddData = async () => {
    const { selectedFilePath } = this.state;

    this.setState({ warnings: [], success: '' });
    const jsonData = readJsonFromFile(selectedFilePath, 0); // assumes first sheet
    const originalCols = Object.keys(jsonData[0]);
    const { emailColumnName, idColumnName } = getMatchingColumnNames(
      originalCols,
    );

    if (idColumnName && emailColumnName) {
      this.setState({
        warnings: ['Found both email and action ID column.'],
      });
      return;
    }

    let dataSourceField;
    let dbSourceField;
    let dbTargetField;
    if (idColumnName && !emailColumnName) {
      dataSourceField = idColumnName;
      dbSourceField = ACTION_ID_COLUMN_NAME;
      dbTargetField = EMAIL_COLUMN_NAME;
    } else if (!idColumnName && emailColumnName) {
      dataSourceField = emailColumnName;
      dbSourceField = EMAIL_COLUMN_NAME;
      dbTargetField = ACTION_ID_COLUMN_NAME;
    } else if (!idColumnName && !emailColumnName) {
      this.setState({
        warnings: ['Found neither email nor action ID column.'],
      });
      return;
    }
    const { inserted, jsonData: newJsonData } = await this.addData(
      jsonData,
      dataSourceField,
      dbSourceField,
      dbTargetField,
    );

    const workbook = xlsx.readFile(selectedFilePath);
    const newSheet = xlsx.utils.json_to_sheet(newJsonData, {
      header: originalCols.concat(dbTargetField),
    });

    let newSheetName = `Copy of ${workbook.SheetNames[0]}`;
    for (let copyCounter = 1; copyCounter < 100; copyCounter += 1) {
      if (workbook.SheetNames.includes(newSheetName)) {
        newSheetName = `Copy of ${workbook.SheetNames[0]} (${copyCounter})`;
      } else {
        break;
      }
    }
    if (workbook.SheetNames.includes(newSheetName)) {
      throw new Error("Couldn't find valid sheet name.");
    }

    xlsx.utils.book_append_sheet(workbook, newSheet, newSheetName);
    xlsx.writeFile(workbook, selectedFilePath);

    this.setState({
      success:
        `Added sheet "${newSheetName}" to workbook with new column ` +
        `"${dbTargetField}" with ${inserted.length} records found.`,
    });
  };

  addData = async (jsonData, dataSourceField, dbSourceField, dbTargetField) => {
    const { password } = this.props;
    const db = new Db(password);

    const inserted = [];
    for (const obj of jsonData) {
      const sourceValue = obj[dataSourceField];
      if (sourceValue) {
        const dbMatch = await db.getBy(dbSourceField, String(sourceValue));
        if (dbMatch) {
          obj[dbTargetField] = dbMatch[dbTargetField];
          inserted.push(obj);
        } else {
          // No object in db matches this one.
          obj[dbTargetField] = '';
        }
      } else {
        // There's no value in the incoming data in this row that we can use
        // to look anything up.
        obj[dbTargetField] = '';
      }
    }

    return { inserted, jsonData };
  };

  render() {
    const { selectedFilePath, success, warnings } = this.state;
    return (
      <div data-tid="container">
        <h1>Add To File</h1>
        <p>
          Open a spreadsheet workbook, and this tool will attempt to add a
          column of either emails or action IDs to the data on the first sheet,
          depending on what&rsquo;s missing. The resulting table will be saved
          in a new sheet.
        </p>
        <p>
          Selected file:{' '}
          <Input
            type="text"
            readOnly
            value={selectedFilePath}
            style={{ width: '50vw' }}
            onClick={this.handleClickOpen}
          />
          <Button onClick={this.handleClickOpen}>Open</Button>
        </p>
        <p>
          <Button onClick={this.handleAddData}>Add data to workbook</Button>
        </p>
        {success && <p>{success}</p>}
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

const mapStateToProps = state => ({ password: state.auth.password });

export default connect(mapStateToProps)(AddToFile);
