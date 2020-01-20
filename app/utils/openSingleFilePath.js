const openSingleFilePath = async () => {
  const {
    remote: { dialog },
  } = require('electron');
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.filePaths[0];
};

export default openSingleFilePath;
