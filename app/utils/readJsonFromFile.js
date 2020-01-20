import xlsx from 'xlsx';

import { sheetByIndex } from './xlsxHelpers';

const readJsonFromFile = (path, sheetIndex) => {
  const workbook = xlsx.readFile(path);
  const sheet = sheetByIndex(workbook, sheetIndex);
  return xlsx.utils.sheet_to_json(sheet);
};

export default readJsonFromFile;
