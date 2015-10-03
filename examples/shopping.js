const taim = require('../src');
const Promise = require('bluebird');
const { concat, join, map, pipeP, prop, split } = require('ramda');
const request = Promise.promisify(require('request'));

const makeHeader = concat('# ');
const makeTodo   = concat('- [ ] ');

//    getList :: URL -> String
const getList = taim('getList', (url) =>
  request(url).then(prop(1)))

//    formatList :: URL -> String
const formatList = pipeP(
  getList,
  split('\n'),
  map(makeTodo),
  join('\n'),
  concat(makeHeader('my shopping list\n\n'))
);

formatList('http://j.mp/my-grocery-shopping-list')
  .then(console.log);
