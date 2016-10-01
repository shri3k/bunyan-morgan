# bunyan-morgan
[![Build Status](https://travis-ci.org/shri3k/bunyan-morgan.svg?branch=master)](https://travis-ci.org/shri3k/bunyan-morgan) [![Dependency Status](https://gemnasium.com/badges/github.com/shri3k/bunyan-morgan.svg)](https://gemnasium.com/github.com/shri3k/bunyan-morgan) [![Coverage Status](https://coveralls.io/repos/github/shri3k/bunyan-morgan/badge.svg?branch=master)](https://coveralls.io/github/shri3k/bunyan-morgan?branch=master)

Gives bunyan like (js object) format to morgan's log format

## Install  
```shell
npm install bunyan-morgan
```
## Compatible
- express
- connect 
- connect like libraries
- bunyan (as a serializer)

## Usage

**For Express as middleware**
```js
const bm = require('bunyan-morgan');
const app = require('express')();

app.use(bm('combined')); // pass morgan's predefined format
app.use('/', (req,res,next)=>{
  res.send('test');
});

app.listen(3000);
```

**For Express as bunyan serializer**
```js
const bunyan = require('bunyan');
const bm = require('bunyan-morgan');
const app = require('express')();

let logger = bunyan.createLogger({
	name: 'my_app',
	serializers: {
		morgan: bm.morgan('combined') // pass morgan's predef format here
	}
});

app.use('/', (req,res,next)=>{
	log.info({morgan:{res, req}}, 'morgan-esque log');
  res.send('test');
});

app.listen(3000);
```
## [Morgan's Predefined formats](https://github.com/expressjs/morgan#predefined-formats)
## Format of morgan not yet supported
- `dev`

## Test  
```shell
npm test
```


