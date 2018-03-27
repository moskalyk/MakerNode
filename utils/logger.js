const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);
const name = 'maker';

// Init the actual logger
const log = bunyan.createLogger({
  name,
  serializers: bunyan.stdSerializers,
  streams: [
    {
      path: './utils/logs/index.log',
      level: 'debug',
    },
    {
      stream: prettyStdOut,
      level: 'debug',
    },
  ],
});

// Define at runtime
log.fields.module = undefined;

module.exports = log;
