const component = 'sling-web-component-message';
const customCode = false;

module.exports = {
  main: (browser) => {
    browser.url(`http://localhost:8777/packages/${component}/${customCode ? 'public/regression' : 'public'}/index.html`)
      .saveScreenshot(`./reports/${component}/${component}.png`)
      .end();
  },
};