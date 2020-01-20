import stripEmail from '../utils/stripEmail';
import {
  ACTION_ID_COLUMN_NAME,
  EMAIL_COLUMN_NAME,
  STRIPPED_EMAIL_COLUMN_NAME,
} from '../config';

const stripColName = n => n.replace(/[\s_-]/g, '').toLowerCase();

const getMatchingColumnNames = cols => {
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

  return { emailColumnName, idColumnName };
};

const jsonDataToRecords = jsonData => {
  const cols = Object.keys(jsonData[0]);
  const { emailColumnName, idColumnName } = getMatchingColumnNames(cols);

  return jsonData
    .filter(obj => obj[emailColumnName] && obj[idColumnName])
    .map(obj => ({
      [EMAIL_COLUMN_NAME]: String(obj[emailColumnName]),
      [STRIPPED_EMAIL_COLUMN_NAME]: stripEmail(String(obj[emailColumnName])),
      [ACTION_ID_COLUMN_NAME]: String(obj[idColumnName]),
    }));
};

export default jsonDataToRecords;
