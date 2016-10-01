const app = require('express')();
const bunyan = require('bunyan');
const bm = require('../../');
const morgan = require('morgan');

const logger = bunyan.createLogger({
  name: 'bunyan-morgan',
  serializers: {
    morgan: bm.morgan('combined')
  }
});

// app.use(morgan('common'));
// app.use(bm('common'));
app.use('/', (req, res, next) => {
  logger.info({
    morgan: {
      req,
      res
    }
  }, 'testing');
  res.send('hi');
});
app.listen(3000, port => {
  console.log(`Listening on 3000`);
});
