process.argv.NODE_ENV = 'test';
const http = require('http');
const morganB = require('../');
const test = require('tape');

test('string format when passed', t => {
  let keys = morganB._fmtToAry(':res :req :test :test2');
  t.deepEqual(keys, {
    "res": undefined,
    "req": undefined,
    "test": undefined,
    "test2": undefined
  }, 'with semicolons no brackets');
  keys = morganB._fmtToAry(':res :req[something] :test[HTTP/2] :test2');
  t.deepEqual(keys, {
    "res": undefined,
    "req": "something",
    "test": "HTTP/2",
    "test2": undefined
  }, 'with semicolons and brackets');
  t.end();
});

test('morgan\'s default logs', t => {
  t.equal(
    morganB._getMorganPredefLog('combined'),
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    'comdined'
  );
  t.equal(
    morganB._getMorganPredefLog('common'),
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
    'common'
  );
  t.equal(
    morganB._getMorganPredefLog('default'),
    ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    'default'
  );
  t.equal(
    morganB._getMorganPredefLog('short'),
    ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
    'short'
  );
  t.equal(
    morganB._getMorganPredefLog('tiny'),
    ':method :url :status :res[content-length] - :response-time ms',
    'tiny'
  );
  t.end();
});

test('format from the server', t => {
  function removeDate(_tmp) {
    delete _tmp.date;
    return _tmp;
  }
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    let fmtFn = morganB._morgan(':method :url');
    t.deepEqual(fmtFn({
      req,
      res
    }), {
      "method": "GET",
      "url": "/"
    }, 'with custom format');

    fmtFn = morganB._morgan('combined');
    t.deepEqual(
      removeDate(fmtFn({
        req,
        res
      })), {
        "remote-addr": "::ffff:127.0.0.1",
        "referrer": undefined,
        "res": undefined,
        "remote-user": undefined,
        "user-agent": undefined,
        "method": "GET",
        "url": "/",
        "http-version": "1.1",
        "status": "200"
      },
      'with combined format'
    );
    fmtFn = morganB._morgan('common');
    t.deepEqual(
      removeDate(fmtFn({
        req,
        res
      })), {
        "remote-addr": "::ffff:127.0.0.1",
        "remote-user": undefined,
        "res": undefined,
        "method": "GET",
        "url": "/",
        "http-version": "1.1",
        "status": "200"
      },
      'with common format'
    );
    fmtFn = morganB._morgan('short');
    t.deepEqual(
      fmtFn({
        req,
        res
      }), {
        "remote-addr": "::ffff:127.0.0.1",
        "response-time": undefined,
        "remote-user": undefined,
        "res": undefined,
        "method": "GET",
        "url": "/",
        "http-version": "1.1",
        "status": "200"
      },
      'with short format'
    );
    fmtFn = morganB._morgan('tiny');
    t.deepEqual(
      fmtFn({
        req,
        res
      }), {
        "response-time": undefined,
        "res": undefined,
        "method": "GET",
        "url": "/",
        "status": "200"
      },
      'with tiny format'
    );
    t.end();
    res.end();
  }).listen(3001);
  http.get('http://localhost:3001', () => {
    server.close();
  });
});
