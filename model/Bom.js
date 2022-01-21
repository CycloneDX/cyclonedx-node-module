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
 * Copyright (c) OWASP Foundation. All Rights Reserved.
 */

const builder = require('xmlbuilder')
const uuid = require('uuid')
const Component = require('./Component')
const CycloneDXObject = require('./CycloneDXObject')
const Metadata = require('./Metadata')
const Tool = require('./Tool')
const program = require('../package.json')
const Dependency = require('./Dependency')
const parsePackageJsonName = require('parse-packagejson-name')
const { PackageURL } = require('packageurl-js')

class Bom extends CycloneDXObject {
  constructor (pkg, componentType, includeSerialNumber = true, includeLicenseText = true, lockfile) {
    super()
    this._schemaVersion = '1.3'
    this._includeSerialNumber = includeSerialNumber
    this._includeLicenseText = includeLicenseText
    this._version = 1
    if (includeSerialNumber) {
      this._serialNumber = 'urn:uuid:' + uuid.v4()
    }
    if (pkg) {
      this._metadata = this.createMetadata(pkg, componentType)
      this._components = this.listComponents(pkg, lockfile)
      this._dependencies = this.listDependencies(pkg)
    } else {
      this._components = []
      this._dependencies = []
    }
  }

  listDependencies (pkg) {
    const list = []
    this.createDependency(pkg, list)
    return list
  }

  createDependency (pkg, list) {
    // read-installed with default options marks devDependencies as extraneous
    // if a package is marked as extraneous, do not include it as a dependency
    if (pkg.extraneous) return
    const rootBomRef = this.createBomRef(pkg)
    const deplist = []
    if (pkg._dependencies && Object.keys(pkg._dependencies).length !== 0) {
      Object.keys(pkg._dependencies)
        .map(x => pkg.dependencies[x])
        .filter(x => x !== undefined) // remove cycles
        .map(x => deplist.push(new Dependency(this.createBomRef(x), this.createDependency(x, list))))
      list.push(new Dependency(rootBomRef, deplist))
    }
    return deplist
  }

  createBomRef (pkg) {
    let bomRef = null
    const pkgIdentifier = parsePackageJsonName(pkg.name)
    let group = (pkgIdentifier.scope) ? pkgIdentifier.scope : undefined
    if (group) group = '@' + group
    const name = (pkgIdentifier.fullName) ? pkgIdentifier.fullName : undefined
    const version = (pkg.version) ? pkg.version : undefined
    if (name && version) { bomRef = new PackageURL('npm', group, name, version, null, null).toString() }
    return bomRef
  }

  createMetadata (pkg, componentType) {
    const metadata = new Metadata()
    metadata.component = new Component(pkg, this.includeLicenseText)
    metadata.component.type = componentType
    const tool = new Tool('CycloneDX', 'Node.js module', program.version)
    metadata.tools.push(tool)
    return metadata
  }

  /**
   * For all modules in the specified package, creates a list of
   * component objects from each one.
   */
  listComponents (pkg, lockfile) {
    const list = {}
    const isRootPkg = true
    this.createComponent(pkg, list, lockfile, isRootPkg)
    return Object.keys(list).map(k => (list[k]))
  }

  /**
   * Given the specified package, create a CycloneDX component and add it to the list.
   */
  createComponent (pkg, list, lockfile, isRootPkg = false) {
    // read-installed with default options marks devDependencies as extraneous
    // if a package is marked as extraneous, do not include it as a component
    if (pkg.extraneous) return
    if (!isRootPkg) {
      const component = new Component(pkg, this.includeLicenseText, lockfile)
      if (component.externalReferences === undefined || component.externalReferences.length === 0) {
        delete component.externalReferences
      }
      if (list[component.purl]) return // remove cycles
      list[component.purl] = component
    }
    if (pkg.dependencies) {
      Object.keys(pkg.dependencies)
        .map(x => pkg.dependencies[x])
        .filter(x => typeof (x) !== 'string') // remove cycles
        .map(x => this.createComponent(x, list, lockfile))
    }
  }

  addComponent (component) {
    if (!this._components) this._components = []
    this._components.push(component)
  }

  get includeSerialNumber () {
    return this._includeSerialNumber
  }

  set includeSerialNumber (value) {
    this._includeSerialNumber = value
  }

  get includeLicenseText () {
    return this._includeLicenseText
  }

  set includeLicenseText (value) {
    this._includeLicenseText = value
  }

  get metadata () {
    return this._metadata
  }

  set metadata (value) {
    this._metadata = this.validateType('Metadata', value, Metadata)
  }

  get components () {
    return this._components
  }

  set components (value) {
    this._components = value
  }

  get dependencies () {
    return this._dependencies
  }

  set dependencies (value) {
    this._dependencies = value
  }

  addDependency (dependency) {
    if (!this._dependencies) this._dependencies = []
    this._dependencies.push(dependency)
  }

  get externalReferences () {
    return this._externalReferences
  }

  set externalReferences (value) {
    this._externalReferences = value
  }

  get version () {
    return this._version
  }

  set version (value) {
    this._version = this.validateType('Version', value, Number)
  }

  get schemaVersion () {
    return this._schemaVersion
  }

  get serialNumber () {
    return this._serialNumber
  }

  set serialNumber (value) {
    this._serialNumber = this.validateType('Serial number', value.String)
  }

  toJSON () {
    const json = {
      bomFormat: 'CycloneDX',
      specVersion: this._schemaVersion,
      serialNumber: this._serialNumber,
      version: this._version,
      metadata: this._metadata,
      components: this._components,
      dependencies: this._dependencies
    }
    return JSON.stringify(json, null, 2)
  }

  toXML () {
    const bom = builder.create('bom', { encoding: 'utf-8', separateArrayItems: true })
      .att('xmlns', 'http://cyclonedx.org/schema/bom/' + this._schemaVersion)
    if (this._serialNumber) {
      bom.att('serialNumber', this._serialNumber)
    }
    bom.att('version', this._version)

    if (this._metadata) {
      const metadata = bom.ele('metadata')
      metadata.ele(this._metadata.toXML())
    }

    const componentsNode = bom.ele('components')
    if (this._components && this._components.length > 0) {
      const value = []
      for (const component of this._components) {
        value.push(component.toXML())
      }
      componentsNode.ele(value)
    }

    if (this._dependencies && this._dependencies.length > 0) {
      const dependenciesNode = bom.ele('dependencies')
      const value = []
      for (const dependency of this._dependencies) {
        value.push(dependency.toXML())
      }
      dependenciesNode.ele(value)
    }

    return bom.end({
      pretty: true,
      indent: '  ',
      newline: '\n',
      width: 0,
      allowEmpty: false,
      spacebeforeslash: ''
    })
  }
}

module.exports = Bom
