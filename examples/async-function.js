// Async function

const taim = require('../lib');
const Promise = require('bluebird');

const delay = async () => {
  await Promise.delay(1000);
}

taim('zzz', delay)();
