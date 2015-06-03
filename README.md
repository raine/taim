# taim [![npm version](https://badge.fury.io/js/taim.svg)](https://www.npmjs.com/package/taim)

> measure execution time of functions and promises

```js
taim(require)('./package.json');
var Promise = taim(require)('bluebird');
taim('promisify', Promise.promisifyAll)(fs);
```

<img width="170" height="81" src="https://raw.githubusercontent.com/raine/taim/media/img.png" />

## install

```sh
npm install taim
```

## usage
 
#### `taim(label?, Function)`

Returns a decorated version of a function that when invoked, measures and
prints the execution time of the function.

If the function returns a Promise, it will instead measure the time until the
promise is resolved.

You can optionally pass a label that will shown in the output.

#### `taim(label?, Promise)`

Wraps a Promise (or a thenable) so that when it resolves, duration from
invoking `taim` to the promise resolving is printed to stderr.

#### `taim.pipe(Function...)`
#### `taim.compose(Function...)`

Before dispatching to [Ramda's][ramda] [`pipe`][pipe] or
[`compose`][compose], applies `taim` to each function.

#### `taim.pipeP(Function...)`
#### `taim.composeP(Function...)`

## example

```js
var taim = require('taim');
var Promise = require('bluebird');
var {pipeP, prop, concat, map, split, join} = require('ramda');
var request = Promise.promisify(require('request'));

var makeHeader = concat('# ');
var makeTodo   = concat('- [ ] ');

var getList = taim('getList', (url) =>
  request(url).then(prop(1)))

var makeShoppingList = taim.pipeP(
  getList,
  split('\n'),
  map(makeTodo),
  join('\n'),
  concat(makeHeader('my shopping list\n\n'))
);

makeShoppingList('http://j.mp/my-grocery-shopping-list')
  .then(console.log);
```

<img width="322" height="279" src="https://raw.githubusercontent.com/raine/taim/media/shopping.png" />

---

See also [`treis`][treis], a tool to debug and observe functions.

[treis]: https://github.com/raine/treis
[ramda]: http://ramdajs.com
[pipe]: http://ramdajs.com/docs/#pipe
[compose]: http://ramdajs.com/docs/#compose
