var bunyan = require('bunyan');

function createLogger(name) {
  var logger = bunyan.createLogger({
    name: name,
    streams: [
      {
        level: 'info',
        stream: process.stdout            // log INFO and above to stdout
      },
      {
        level: 'error',
        stream: process.stdout
      }
    ]
  });

  logger.log = logger.info;
  return logger;
}

module.exports = {
  createLogger: createLogger
};
