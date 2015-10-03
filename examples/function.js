const taim = require('../src');
const reallyDumbSleep = () => {
  let i = 0;
  while (i < 900000000) {
    i++;
  }
}

taim('zzz', reallyDumbSleep)();
