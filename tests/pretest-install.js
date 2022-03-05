const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

/* Installs the npm packages with npm ci, if not already done
*/
function testInstall(testSubDir) {
    if (!fs.existsSync(path.join(testSubDir, 'node_modules'))) {
        console.log('Calling NPM ci (installation with package-lock.json) in ' + testSubDir + '..');
        switch (os.platform()) {
            case 'win32':
                child_process.execFileSync('cmd', ['/c', 'npm', 'ci'], {cwd: testSubDir});
                break;
            case 'linux':
                child_process.execFileSync('npm', ['ci'], {cwd: testSubDir});
                break;
            default:
                console.log('Installation not implemented for platform ' + os.platform());
                process.exit(1);
                break;
        }
    }
}

/* Returns list of strings of e2e test sub directories (with package-lock.json)
*/
function getE2ETestSubDirs(testDir) {
    return fs
    .readdirSync(testDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => fs.existsSync(path.join(testDir, dirent.name, 'package-lock.json')))
    .map(dirent => path.join(testDir, dirent.name))
}

for (const testSubDir of getE2ETestSubDirs(__dirname)) {
    testInstall(testSubDir);
}