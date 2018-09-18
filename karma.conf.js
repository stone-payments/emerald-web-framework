const path = require('path');
process.env.CHROME_BIN = require('puppeteer').executablePath();

let filesPattern = 'packages/*/src/**/*.test.js';
if (process.env.FILES_PATTERN) {
  filesPattern = process.env.FILES_PATTERN;
}

module.exports = (config) => {
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    browserNoActivityTimeout: 60000,
    singleRun: true,
    frameworks: ['mocha', 'chai-sinon'],
    files: [{
      pattern: filesPattern,
      watched: false,
    }],
    preprocessors: {
      [filesPattern]: ['webpack'],
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: {
                esModules: true,
              },
            },
            include: path.resolve('./packages/'),
            exclude: /((node_modules|dev|dist)(\\|\/|$)|(test|bundle)\.js$)/,
          },
        ],
      },
    },
    mochaReporter: {
      showDiff: true,
    },
    reporters: ['mocha', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join('coverage/integration'),
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      thresholds: {
        emitWarning: false,
        global: {
          statements: 50,
          branches: 30,
          functions: 40,
          lines: 50,
        },
      },
    },
  });
};
