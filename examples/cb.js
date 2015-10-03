const taim = require('../src');

const sleeper = (ms, cb) =>
  setTimeout(() => cb(null, 'took a nap, sorry'), ms)

taim.cb('sleeper', sleeper)(500, (err, excuse) => 
  console.log('the excuse was:', excuse))
