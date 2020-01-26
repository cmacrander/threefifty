import getMatchingColumnNames from './getMatchingColumnNames';
import stripEmail from './stripEmail';
import ValidationError from './ValidationError';
import {
  ACTION_ID_COLUMN_NAME,
  EMAIL_COLUMN_NAME,
  STRIPPED_EMAIL_COLUMN_NAME,
} from '../config';

const jsonDataToRecords = jsonData => {
  const cols = Object.keys(jsonData[0]);
  const { emailColumnName, idColumnName } = getMatchingColumnNames(cols);

  if (!emailColumnName || !idColumnName) {
    throw new ValidationError(
      `Could not find both email and action ID columns: ${JSON.stringify(
        jsonData,
      )}`,
    );
  }

  return jsonData
    .filter(obj => obj[emailColumnName] && obj[idColumnName])
    .map(obj => ({
      [EMAIL_COLUMN_NAME]: String(obj[emailColumnName]),
      [STRIPPED_EMAIL_COLUMN_NAME]: stripEmail(String(obj[emailColumnName])),
      [ACTION_ID_COLUMN_NAME]: String(obj[idColumnName]),
    }));
};

export default jsonDataToRecords;
