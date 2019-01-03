const taim = require('../lib');
const reallyDumbSleep = () => {
  let i = 0;
  while (i < 900000000) {
    i++;
  }
}

taim('zzz', reallyDumbSleep)();
