const fs = require('fs');
const path = require('path');

interface IWrite {
  (
    type: string,
    id: string,
    object: any,
    storageLocation: string
  ): void;
}

const createIfNotExists = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

export const write: IWrite = (type, id, object, storageLocation) => {
  createIfNotExists(path.join(storageLocation, type));
  fs.writeFileSync(path.join(storageLocation, type, `${id}.json`), JSON.stringify(object, null, 2));
};

export const read = (type: string, id: string, storageLocation: string) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(storageLocation, type, `${id}.json`)));
  } catch (err) {
    createIfNotExists(`${storageLocation}/${type}`);
    return {};
  }
};

export default read;