const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { document } = new JSDOM(
  `<!doctype html><html><body><div id='root'></div></body></html>`
).window;

global.document = document;