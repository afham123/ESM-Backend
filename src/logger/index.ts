const level = require("./config/level");
const handleLogger = require("./handleLogger");

/**
 * exported functions
 * warn, info, error, debug
 */
function getLogger() {
  // .info('inside getlogger', t);
  const logger = {
    warn: handleLogger.bind(null, level.warn),
    info: handleLogger.bind(null, level.info),
    debug: handleLogger.bind(null, level.debug),
    error: handleLogger.bind(null, level.error),
  };
  return logger;
}

const logger = getLogger();
export = logger;