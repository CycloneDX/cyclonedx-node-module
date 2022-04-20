/*
 * This file is part of CycloneDX Node Module.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * Copyright (c) Steve Springett. All Rights Reserved.
 */

const fs = require('fs')
const filePath = require('path')
const readInstalled = require('read-installed')
const { yarnToNpm } = require('synp')

const Bom = require('./model/Bom') // do I just want to use this model?

readPackageLock = (path) => {
  let lockfileContents = "";

  if (fs.existsSync(filePath.join(path, 'package-lock.json'))) {
    lockfileContents = JSON.parse(fs.readFileSync(filePath.join(path, 'package-lock.json')))
  } else if (fs.existsSync(filePath.join(path, 'yarn.lock'))) {
    // Convert the yarn lock file to a package-lock.json string, prior to parsing JSON.
    lockfileContents = JSON.parse(yarnToNpm(path))
  }

  // Add a console warning for users that have both npm and yarn lock files.
  if (fs.existsSync(filePath.join(path, 'package-lock.json')) && fs.existsSync(filePath.join(path, 'yarn.lock'))) {
    console.warn('Please review your project as multiple package management lock files exist, defaulting to package-lock.json')
  } 

  return lockfileContents;
}

createbomFromFile = (componentType, includeSerialNumber, includeLicenseText, path, options, callback) => {
  readInstalled(path, options, (err, pkgInfo) => {
    // if there was an error
    if (err) { callback(err, null); return }

    const lockFileContents = readPackageLock(path);

    const bom = new Bom(pkgInfo, componentType, includeSerialNumber, includeLicenseText, lockFileContents)

    callback(null, bom)
  });
};

createbomFromText = (componentType, includeSerialNumber, includeLicenseText, lockFileContents, options, callback) => {
  readInstalled(path, options, (err, pkgInfo) => {
    // if there was an error then call the callback with the error
    if (err) { callback(err, null); return }

    // otherwise, create the SBOM
    const bom = new Bom(pkgInfo, componentType, includeSerialNumber, includeLicenseText, lockFileContents)

    // pass the new bom to the callback
    callback(null, bom)
  });
};


createbom = (componentType, includeSerialNumber, includeLicenseText, path, options, callback) => readInstalled(path, options, (err, pkgInfo) => {
  if (err) { callback(err, null); return }
  const lockfileContents = readPackageLock(path);
  const bom = new Bom(pkgInfo, componentType, includeSerialNumber, includeLicenseText, lockfileContents)
  callback(null, bom)
});

mergebom = function mergebom (doc, additionalDoc) {
  const additionalDocComponents = additionalDoc.getElementsByTagName('component')
  // appendChild actually removes the element from additionalDocComponents
  // which is why we use a while loop instead of a for loop
  while (additionalDocComponents.length > 0) {
    doc.getElementsByTagName('components')[0].appendChild(
      additionalDocComponents[0]
    )
  }
  return true
}

module.exports = [
  createbomFromFile,
  createbomFromText,
  createbom,
  mergebom,
]
