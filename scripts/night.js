const { exec } = require('shelljs');
const { join } = require('path');
const camelcase = require('camelcase');
const os = require('os');

const getScope = require('./helpers/getScope');

const scope = getScope();

if (scope === '*') {
  throw new Error('A package must be provided. Run "npm run night package-name".');
}

console.log(`Testing ${scope !== '*' ? scope : 'all packages'}\n`);

const nightwatchBin = join('node_modules/.bin/nightwatch');
const httpServerBin = join('node_modules/.bin/http-server');

const setupSelenium = 'node selenium-setup';
const httpSever = `${httpServerBin} . -s -p 8777 -c-1`;

const testFile = `packages/${scope}/src/component/${camelcase(scope).replace('slingWebComponent', '')}.regression.test.js`;


if (os.platform() === 'win32') {
  const killNode = 'taskkill /im node.exe /F';
  exec(`${setupSelenium}`)
  exec(`call start /MIN "h" ${httpSever}`, { async: true });

  setTimeout(() => {
    exec(`${nightwatchBin} ${testFile} && ${killNode}`);
  }, 1000);

} else {
  const killNode = 'kill $(ps aux | grep \'node\' | awk \'{print $2}\')';
  exec(`${setupSelenium} && ${httpSever} & ${nightwatchBin} ${testFile} && ${killNode}`);
}