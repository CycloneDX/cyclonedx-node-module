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

const parsePackageJsonName = require('parse-packagejson-name')
const { PackageURL } = require('packageurl-js')
const CycloneDXObject = require('./CycloneDXObject')
const LicenseChoice = require('./LicenseChoice')
const HashList = require('./HashList')
const ExternalReferenceList = require('./ExternalReferenceList')
const OrganizationalEntity = require('./OrganizationalEntity')
const Swid = require('./Swid')

/**
 * @typedef {"application"|"framework"|"library"|"container"|"operating-system"|"device"|"firmware"|"file"} ComponentType
 * @typedef {"required"|"optional"|"excluded"} ComponentScope
 */
class Component extends CycloneDXObject {
  // region required properties

  /** @type {ComponentType} */
  #type = 'library'
  /** @type {string} */
  #name = ''

  // endregion required properties

  // region optional properties

  /** @type {string|undefined} */
  #author
  /** @type {string|undefined} */
  #bomRef
  /** @type {string|undefined} */
  #copyright
  /** @type {string|undefined} */
  #cpe
  /** @type {string|undefined} */
  #description
  /** @type {ExternalReferenceList|undefined} */
  #externalReferences
  /** @type {string|undefined} */
  #group
  /** @type {HashList|undefined} */
  #hashes
  /** @type {LicenseChoice|undefined} */
  #licenses
  /** @type {string|undefined} */
  #publisher
  /** @type {string|undefined} */
  #purl
  /** @type {ComponentScope|undefined} */
  #scope
  /** @type {OrganizationalEntity|undefined} */
  #supplier
  /** @type {Swid|undefined} */
  #swid
  /** @type {string|undefined} */
  #version

  // endregion optional properties

  /**
   * @param {object|undefined} [pkg]
   * @param {boolean} [includeLicenseText]
   * @param {object|undefined} [lockfile]
   */
  constructor (pkg, includeLicenseText = true, lockfile) {
    super()

    if (pkg) {
      const pkgIdentifier = parsePackageJsonName(pkg.name)

      this.name = pkgIdentifier.fullName

      this.type = this.determinePackageType(pkg)

      try {
        this.version = pkg.version
      } catch (e) { /* pass */ }

      this.group = pkgIdentifier.scope
      if (this.group) {
        this.group = '@' + this.group
      }

      try {
        this.description = pkg.description
      } catch (e) { /* pass */ }

      try {
        this.licenses = new LicenseChoice(pkg, includeLicenseText)
      } catch (e) { /* pass */ }

      this.hashes = new HashList(pkg, lockfile)

      this.externalReferences = new ExternalReferenceList(pkg)

      if (this.name && this.version) {
        this.purl = new PackageURL('npm', this.group, this.name, this.version, null, null).toString()
      }

      if (pkg.author instanceof Object) {
        try {
          this.author = pkg.author.name
        } catch (e) { /* pass */ }
      }

      this.bomRef = this.purl
    } else {
      this.hashes = new HashList()
      this.externalReferences = new ExternalReferenceList()
    }
  }

  /**
   * If the author has described the module as a 'framework', the take their
   * word for it, otherwise, identify the module as a 'library'.
   *
   * @returns {"framework"|"library"}
   */
  determinePackageType (pkg) {
    if (pkg && Object.prototype.hasOwnProperty.call(pkg, 'keywords')) {
      for (const keyword of pkg.keywords) {
        if (keyword.toLowerCase() === 'framework') {
          return 'framework'
        }
      }
    }
    return 'library'
  }

  /**
   * @returns {(ComponentType)[]}
   */
  static supportedComponentTypes () {
    return ['application', 'framework', 'library', 'container', 'operating-system', 'device', 'firmware', 'file']
  }

  /**
   * @returns {(ComponentScope)[]}
   */
  static supportedComponentScopes () {
    return ['required', 'optional', 'excluded']
  }

  /**
   * @returns {ComponentType}
   */
  get type () {
    return this.#type
  }

  /**
   * @see Component.supportedComponentTypes()
   * @param {ComponentType} value
   */
  set type (value) {
    this.#type = this.validateChoice('Type', value, Component.supportedComponentTypes())
  }

  /**
   * @returns {string|undefined}
   */
  get bomRef () {
    return this.#bomRef
  }

  /**
   * @param {string|undefined} value
   */
  set bomRef (value) {
    this.#bomRef = this.validateType('bom-ref', value, String)
  }

  /**
   * @returns {OrganizationalEntity|undefined}
   */
  get supplier () {
    return this.#supplier
  }

  /**
   * @param {OrganizationalEntity|undefined} value
   */
  set supplier (value) {
    this.#supplier = this.validateType('Supplier', value, OrganizationalEntity)
  }

  /**
   * @returns {string|undefined}
   */
  get author () {
    return this.#author
  }

  /**
   * @param {string|undefined} value
   */
  set author (value) {
    this.#author = this.validateType('Author', value, String)
  }

  /**
   * @returns {string|undefined}
   */
  get publisher () {
    return this.#publisher
  }

  /**
   *
   * @param {string|undefined} value
   */
  set publisher (value) {
    this.#publisher = this.validateType('Publisher', value, String)
  }

  /**
   * @returns {string|undefined}
   */
  get group () {
    return this.#group
  }

  /**
   * @param {string|undefined} value
   */
  set group (value) {
    this.#group = this.validateType('Group', value, String)
  }

  /**
   * @returns {string}
   */
  get name () {
    return this.#name
  }

  /**
   * @param {string} value
   */
  set name (value) {
    this.#name = this.validateType('Name', value, String, true)
  }

  /**
   * @returns {string|undefined}
   */
  get version () {
    return this.#version
  }

  /**
   * @param {string|undefined} value
   */
  set version (value) {
    this.#version = this.validateType('Version', value, String)
  }

  /**
   *
   * @returns {string|undefined}
   */
  get description () {
    return this.#description
  }

  /**
   *
   * @param {string|undefined} value
   */
  set description (value) {
    this.#description = this.validateType('Description', value, String)
  }

  /**
   * @returns {ComponentScope|undefined}
   */
  get scope () {
    return this.#scope
  }

  /**
   * @see Component.supportedComponentScopes()
   * @param {ComponentScope|undefined} value
   */
  set scope (value) {
    this.#scope = value
      ? this.validateChoice('Scope', value, Component.supportedComponentScopes())
      : undefined
  }

  /**
   * @returns {HashList|undefined}
   */
  get hashes () {
    return this.#hashes
  }

  /**
   * @param {HashList|undefined} value
   */
  set hashes (value) {
    this.#hashes = this.validateType('Hashes', value, HashList)
  }

  /**
   * @returns {LicenseChoice|undefined}
   */
  get licenses () {
    return this.#licenses
  }

  /**
   * @param {LicenseChoice|undefined} value
   */
  set licenses (value) {
    this.#licenses = this.validateType('Licenses', value, LicenseChoice)
  }

  /**
   * @returns {string|undefined}
   */
  get copyright () {
    return this.#copyright
  }

  /**
   * @param {string|undefined} value
   */
  set copyright (value) {
    this.#copyright = this.validateType('Copyright', value, String)
  }

  /**
   * @returns {string|undefined}
   */
  get cpe () {
    return this.#cpe
  }

  /**
   * @param {string|undefined} value
   */
  set cpe (value) {
    this.#cpe = this.validateType('CPE', value, String)
  }

  /**
   * @returns {string|undefined}
   */
  get purl () {
    return this.#purl
  }

  /**
   * @param {string|undefined} value
   */
  set purl (value) {
    this.#purl = this.validateType('PURL', value, String)
  }

  /**
   * @returns {Swid|undefined}
   */
  get swid () {
    return this.#swid
  }

  /**
   * @param {Swid|undefined} value
   */
  set swid (value) {
    this.#swid = this.validateType('SWID', value, Swid)
  }

  /**
   * @returns {ExternalReferenceList|undefined}
   */
  get externalReferences () {
    return this.#externalReferences
  }

  /**
   * @param {ExternalReferenceList|undefined} value
   */
  set externalReferences (value) {
    this.#externalReferences = this.validateType('ExternalReferenceList', value, ExternalReferenceList)
  }

  /**
   *
   * @returns {object}
   */
  toJSON () {
    return {
      type: this.type,
      'bom-ref': this.bomRef,
      supplier: this.supplier
        ? this.supplier.toJSON()
        : undefined,
      author: this.author,
      publisher: this.publisher,
      group: this.group,
      name: this.name,
      version: this.version || '',
      description: this.description,
      scope: this.scope,
      hashes: this.hashes && this.hashes.length > 0
        ? this.hashes.toJSON()
        : undefined,
      licenses: this.licenses
        ? this.licenses.toJSON()
        : undefined,
      copyright: this.copyright,
      cpe: this.cpe,
      purl: this.purl,
      swid: this.swid
        ? this.swid.toJSON()
        : undefined,
      externalReferences: this.externalReferences && this.externalReferences.length > 0
        ? this.#externalReferences.toJSON()
        : undefined
    }
  }

  /**
   * @returns {object}
   */
  toXML () {
    return {
      component: {
        '@type': this.type,
        '@bom-ref': this.bomRef,
        supplier: this.supplier
          ? this.supplier.toXML()
          : undefined,
        author: this.author,
        publisher: this.publisher,
        group: this.group,
        name: this.name,
        version: this.version || '',
        description: this.description
          ? { '#cdata': this.description }
          : undefined,
        scope: this.scope,
        hashes: this.hashes && this.hashes.length > 0
          ? this.hashes.toXML()
          : undefined,
        licenses: this.licenses
          ? this.licenses.toXML()
          : undefined,
        copyright: this.copyright,
        cpe: this.cpe,
        purl: this.purl,
        swid: this.swid
          ? this.swid.toXML()
          : undefined,
        externalReferences: this.externalReferences && this.externalReferences.length > 0
          ? this.externalReferences.toXML()
          : undefined
      }
    }
  }
}

module.exports = Component
