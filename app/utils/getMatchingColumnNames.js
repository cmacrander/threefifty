import { ACTION_ID_COLUMN_NAME, EMAIL_COLUMN_NAME } from '../config';

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

  return { emailColumnName, idColumnName };
};

export default getMatchingColumnNames;
