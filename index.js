const morgan = require('morgan');
const onFinished = require('on-finished');

module.exports = bunyanMorgan;

let mod = process.argv.NODE_ENV === 'test' ? module.exports : {};

/**
 * @private
 * @param {string} log format
 * @return {array} 
 */
const _fmtToAry = mod._fmtToAry = fmt => {
  const regex = /:([-\w]{2,})(?:\[([^\]]+)\])?/g;
  let m;
  let results = {};
  /* eslint-disable */
  while (m = regex.exec(fmt)) {
    /* eslint-enable */
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    results[m[1]] = m[2];
  }
  return results;
};

/**
 * @private
 * @param {string} log format
 * @return {string}
 */
const _getMorganPredefLog = mod._getMorganPredefLog = fmt => {
  return morgan[fmt];
};

/**
 * @private
 * @param {string} log format
 * @return {array}
 */
const _keys = mod._keys = fmt => {
  fmt = _getMorganPredefLog(fmt) || fmt;
  return _fmtToAry(String(fmt));
};

/**
 * @param {string} log format
 * @param {object} request object 
 * @param {object} response object 
 * @return {string}
 */
const _morgan = mod._morgan = module.exports.morgan = (format) => {
  const fmt = format;
  return (argsObj) => {
    let {
      req,
      res
    } = argsObj;
    let matchObj = _keys(fmt);
    let resultObj = Object.keys(matchObj).reduce((acc, key) => {
      acc[key] = morgan[key](req, res, matchObj[key]);
      return acc;
    }, {});
    return resultObj;
  };
};

function bunyanMorgan(fmt) {
  if (typeof fmt !== 'string') {
    return new Error(`Type of ${fmt} must be string.`);
  }
  const _serializer = _morgan(fmt);
  // dev format not yet supported
  return (req, res, next) => {
    onFinished(res, () => process.stdout.write(JSON.stringify(_serializer({
      req,
      res
    }))));
    next();
  };
}
