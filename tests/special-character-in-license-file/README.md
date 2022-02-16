## Test: special character in license file

Depending issue is https://github.com/CycloneDX/cyclonedx-node-module/issues/255

This test will fail currently, because special characters in license files are not handled correctly for xml files

The package mariadb@2.5.5 have a file LICENSE, which has the special character \f (form feed) integrated.
During the call `npx @cyclonedx/bom -l`, to get a bom file with included license texts, 
the error `throw new Error(`Invalid character in string: ${str} at index ${res.index}`);` will be thrown.
