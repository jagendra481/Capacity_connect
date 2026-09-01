const logger = {
  info: (msg, meta = '') => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  error: (msg, error = '') => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, error ? error.stack || error : '');
  },
  debug: (msg, meta = '') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
    }
  }
};

module.exports = logger;
