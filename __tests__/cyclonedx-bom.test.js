"use strict";
const path = require("path");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const cliPath = path.resolve(__dirname, "../bin/cyclonedx-bom");

const emptyPackage = path.resolve(__dirname, "empty-package");
const simplePackage = path.resolve(__dirname, "simple-package");

const extBom1 = path.resolve(__dirname, "ext-bom.xml");
const extBom2 = path.resolve(__dirname, "ext-bom2.xml");

describe("cyclonedx-bom", () => {
  describe("BOM is valid", () => {
    test("package without dependencies", async () => {
      const { stdout, stderr } = await exec(`${cliPath} ${emptyPackage}`);
      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });

    test("simple package", async () => {
      const { stdout, stderr } = await exec(`${cliPath} ${simplePackage}`);
      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });

    test("simple package including devDependencies, -d", async () => {
      const { stdout, stderr } = await exec(`${cliPath} ${simplePackage} -d`);
      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });

    test("simple package including devDependencies chane path and options order, -d", async () => {
      const { stdout, stderr } = await exec(`${cliPath} -d ${simplePackage}`);
      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });
  });

  describe("help, -h", () => {
    test("-h prints help", async () => {
      const { stdout, stderr } = await exec(`${cliPath} -h`);
      expect(stdout).toMatchSnapshot();
      expect(stderr).toEqual("");
    });
  });

  describe("additional modules, -a", () => {
    test("-a adds modules from external BOM to empty bom", async () => {
      const { stdout, stderr } = await exec(
        `${cliPath} -a ${extBom1} ${emptyPackage}`
      );

      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });

    test("-a adds modules from external BOM to simple bom", async () => {
      const { stdout, stderr } = await exec(
        `${cliPath} -a ${extBom1} ${simplePackage}`
      );

      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });

    test("-a adds modules from external BOM to simple bom with devDependencies", async () => {
      const { stdout, stderr } = await exec(
        `${cliPath} -d -a ${extBom1} ${simplePackage}`
      );

      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });

    test("multiple additional BOMs", async () => {
      const { stdout, stderr } = await exec(
        `${cliPath} -d -a ${extBom1} -a ${extBom2} ${path.resolve(
          __dirname,
          "simple-package"
        )}`
      );

      expect(stderr).toEqual("");
      expect(stdout).toMatchSnapshot();
    });
  });
});
