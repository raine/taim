const { always } = require('ramda');
const Promise = require('bluebird');
const taim = require('../lib');

const p =
  Promise.delay(1000)
    .then(always('Hello world!'));

taim(p).then(console.log);
