'use strict';

const debug = require('debug')('elint:preset:updateConfigFile');
const fs = require('fs-extra');
const path = require('path');
const { baseDir } = require('../utils/env');

/**
 * 更新配置文件
 */
function updateConfigFile(filePath) {
  const fileParsedObj = path.parse(filePath);
  const fileName = `${fileParsedObj.name}${fileParsedObj.ext}`;
  const destFilePath = path.join(baseDir, fileName);
  const oldFilePath = path.join(
    baseDir,
    `${fileParsedObj.name}.old${fileParsedObj.ext}`
  );

  debug(`file path: ${filePath}`);
  debug(`file dest path: ${destFilePath}`);

  // 旧文件存在，rename
  if (fs.existsSync(destFilePath)) {
    debug('file exists, move.');
    debug(`file old name: ${oldFilePath}`);
    fs.moveSync(destFilePath, oldFilePath, { overwrite: true });
  }

  fs.copyFileSync(filePath, destFilePath);
}

module.exports = updateConfigFile;