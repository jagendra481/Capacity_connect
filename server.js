// Root entrypoint for Capacity Connect Node.js server (Azure App Service / IISNode / local)
const { app, startServer } = require('./backend/src/server.js');

if (require.main === module || process.env.AZURE_WEB_APP || process.env.IISNODE_VERSION) {
  startServer();
}

module.exports = app;
