# taim [![npm version](https://badge.fury.io/js/taim.svg)](https://www.npmjs.com/package/taim)

> measure execution time of functions and promises

## install

```sh
npm install taim
```

## usage
 
#### `taim(label?, Function)`

Returns a decorated version of a function that when invoked, measures and
prints the execution time of the function.

If the function returns a Promise, it will instead measure time until the
promise is resolved.

You can optionally pass a label that will shown in the output.

#### `taim(label?, Promise)`

Wraps a Promise (or a thenable) so that when it resolves, duration from
invoking `taim` to the promise resolving is printed to stderr.

#### `taim.pipe(Function...)`
#### `taim.compose(Function...)`

Before dispatching to [Ramda's][ramda] [`pipe`][pipe] and
[`compose`][compose], applies `taim` to each function.

#### `taim.pipeP(Function...)`
#### `taim.composeP(Function...)`

## example

TODO

[ramda]: http://ramdajs.com
[pipe]: http://ramdajs.com/docs/#pipe
[compose]: http://ramdajs.com/docs/#compose
