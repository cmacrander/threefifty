export const getColumns = sheet => {
  const cellAddressPattern = /^([A-Z]+)([0-9]+)$/;
  const cols = new Set();
  for (const cellAddress of Object.keys(sheet)) {
    if (cellAddressPattern.test(cellAddress)) {
      const [, col] = cellAddressPattern.exec(cellAddress);
      cols.add(col);
    }
  }
  return Array.from(cols);
};

export const getTableColumnNames = sheet => {
  const letters = getColumns(sheet);
  const cols = letters.map(l => {
    const address = `${l}1`;
    return sheet[address];
  });
  return letters.map(l => sheet[`${l}1`].v);
};

export const sheetByIndex = (workbook, i) => {
  const sheetName = workbook.SheetNames[i];
  return workbook.Sheets[sheetName];
};
