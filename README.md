# taim [![npm version](https://badge.fury.io/js/taim.svg)](https://www.npmjs.com/package/taim)

> tʌɪm | measure execution time of functions and promises

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
 
#### `taim(label?, Function) → Function`

Returns a decorated version of a function that when invoked, measures and
prints the execution time of the function.

If the function returns a Promise, it will instead measure the time until the
promise is resolved.

You can optionally pass a label that will shown in the output.

---

#### `taim(label?, Promise) → Function`

Wraps a Promise (or a thenable) so that when it resolves, duration from
invoking `taim` to the promise resolving is printed to stderr.

---

#### `taim.cb(label?, Function) → Function`

Returns a decorated version of a function that when invoked with a callback
function as the last argument, measures and prints the time until the
callback is executed.

```js
const sleeper = (cb) => {
  setTimeout(() => cb('took a nap, sorry'), 500);
}

taim.cb(sleeper)(excuse =>
  console.log('the excuse was:', excuse)
)
```

```
505 ms
the excuse was: took a nap, sorry
```

---

#### `taim.pipe(Function...) → Function`
#### `taim.compose(Function...) → Function`

Before dispatching to [Ramda's][ramda] [`pipe`][pipe] or
[`compose`][compose], applies `taim` to each function.

---

#### `taim.pipeP(Function...) → Function`
#### `taim.composeP(Function...) → Function`

Before dispatching to [Ramda's][ramda] [`pipeP`][pipeP] or
[`composeP`][composeP], applies `taim` to each function.

## example

```js
const Promise = require('bluebird');
const {replace} = require('ramda');
const request = Promise.promisify(require('request'));
const taim = require('taim');

// :: () → [Promise]
const readURLs = require('../lib/read-urls');
const reqHead = taim('req', (uri) => request({ method: 'HEAD', uri }));
const checkURLs = (urls) => urls
  .map(replace(/^\/\//, 'http://'))
  .map(function(url) {
    return reqHead(url).spread(function(res) {
      if (res.statusCode !== 200) throw new Error(res.statusCode);
    });
  }, { concurrency: 1 })

const urls = taim('read urls', readURLs());
taim('all', checkURLs(urls));
```

![](https://raw.githubusercontent.com/raine/taim/media/check-urls.png)

---

See also [`treis`][treis], a tool to debug and observe functions.

[treis]: https://github.com/raine/treis
[ramda]: http://ramdajs.com
[pipe]: http://ramdajs.com/docs/#pipe
[compose]: http://ramdajs.com/docs/#compose
[pipeP]: http://ramdajs.com/docs/#pipeP
[composeP]: http://ramdajs.com/docs/#composeP
