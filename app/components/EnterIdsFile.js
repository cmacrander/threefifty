import React from 'react';
import xlsx from 'xlsx';

import ValidationError from '../utils/ValidationError';

const sheetByIndex = (workbook, i) => {
  const sheetName = workbook.SheetNames[i];
  return workbook.Sheets[sheetName];
};

const openSingleFile = async () => {
  const {
    remote: { dialog },
  } = require('electron');
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.filePaths[0];
};

const readJsonFromFile = (path, sheetIndex) => {
  const workbook = xlsx.readFile(path);
  const sheet = sheetByIndex(workbook, sheetIndex);
  return xlsx.utils.sheet_to_json(sheet);
};

class EnterIdsFile extends React.Component {
  openAndInsert = async () => {
    const { onSubmit, onValidationError } = this.props;

    try {
      const path = await openSingleFile();
      onSubmit(readJsonFromFile(path, 0)); // assumes first sheet
    } catch (e) {
      if (e instanceof ValidationError) {
        onValidationError(e);
      } else {
        throw e;
      }
    }
  };

  render() {
    return (
      <>
        <p>
          The first sheet of the file should have a column called "email", or a
          column called "action ID", or both. Capitalization doesn't matter.
        </p>
        <button onClick={this.openAndInsert}>Open File</button>
      </>
    );
  }
}

export default EnterIdsFile;
