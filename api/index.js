const handler = require('../server/dist/bundle/index.js');
module.exports = handler.default || handler;
