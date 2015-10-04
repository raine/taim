# taim [![npm version](https://badge.fury.io/js/taim.svg)](https://www.npmjs.com/package/taim)

> tʌɪm | measure execution time of functions and promises

<img align="right" src="https://raw.githubusercontent.com/raine/taim/media/img.png" />

```js
const reallyDumbSleep = () => {
  let i = 0;
  while (i < 900000000) {
    i++;
  }
}

taim('zzz', reallyDumbSleep)();
```

### it measures

- execution time of a function
- time until a Promise is resolved
- time until a callback function is invoked

## install

```sh
$ npm install taim
```

## usage

#### `taim(label?, Function) → Function`

Returns a decorated version of a function that when invoked, measures and
prints the execution time of the function.

If the function returns a Promise, it will instead measure the time until the
promise is resolved.

You can optionally pass a label that will shown in the output.

---

#### `taim(label?, Promise) → Promise`

Wraps a Promise (or a thenable) so that when it resolves, duration from
invoking `taim` to the promise resolving is printed to stderr.

```js
const p =
  Promise.delay(1000)
    .then(always('Hello world!'));

taim(p).then(console.log); // Hello world!
```

---

#### `taim.cb(label?, Function) → Function`

Returns a decorated version of a function that when invoked with a callback
function as the last argument, measures and prints the time until the
callback is executed.

```js
const sleeper = (ms, cb) =>
  setTimeout(() => cb(null, 'took a nap, sorry'), ms)

taim.cb('sleeper', sleeper)(500, (err, excuse) =>
  console.log('the excuse was:', excuse))
```

<img src="https://raw.githubusercontent.com/raine/taim/media/sleeper.png" width="274" height="63">

## examples

```js
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const taim = require('taim');

//    readURLs :: () -> Promise [String]
const readURLs = require('../lib/read-urls');

//    reqHead :: String -> Promise Response
const reqHead = taim('req', (uri) => request({ method: 'HEAD', uri }));

//    checkURLs :: [String] -> Promise ()
const checkURLs = (urls) => urls
  .map(function(url) {
    return reqHead(url).spread(function(res) {
      if (res.statusCode !== 200) throw new Error(res.statusCode);
    });
  }, { concurrency: 1 })

const urls = taim('read urls', readURLs());
taim('all', checkURLs(urls));
```

<img src="https://raw.githubusercontent.com/raine/taim/media/check-urls.png" width="338" height="279">

## useful vim mappings

These require [surround.vim](https://github.com/tpope/vim-surround):

```viml
" Surround a word with taim()
nmap <buffer> <Leader>tr ysiwftaim<CR>f(

" Surround a visual selection with taim()
vmap <buffer> <Leader>tr Sftaim<CR>f(

" Use without requiring separately
nmap <buffer> <Leader>tA ysiwfrequire('taim')<CR>f(
vmap <buffer> <Leader>tA Sfrequire('taim')<CR>f(
```

---

See also [`treis`][treis], a tool to debug and observe functions.

[treis]: https://github.com/raine/treis
[ramda]: http://ramdajs.com
