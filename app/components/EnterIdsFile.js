import React from 'react';

import Button from './Button';
import ValidationError from '../utils/ValidationError';
import openSingleFilePath from '../utils/openSingleFilePath';
import readJsonFromFile from '../utils/readJsonFromFile';

class EnterIdsFile extends React.Component {
  openAndInsert = async () => {
    const { onSubmit, onValidationError } = this.props;

    try {
      const path = await openSingleFilePath();
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
        <Button onClick={this.openAndInsert}>Open File</Button>
      </>
    );
  }
}

export default EnterIdsFile;
