// Functions returns a promise

const taim = require('../src');
const Promise = require('bluebird');

const delay = () =>
  Promise.delay(1000);

taim('zzz', delay)();
