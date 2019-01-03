const chalk = require('chalk');
const { allPass, complement, concat, cond, init, isNil, last, pipe, propSatisfies, T, tap, type } = require('ramda');
const prettyHrtime = require('pretty-hrtime');

const COLORS = ['green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
const rotate = (xs) => {
  let i = 0;
  return () => xs[i++ % xs.length];
};

const nextColor = rotate(COLORS);
const getArgs = (label, val) =>
  typeof label !== 'string'
    ? [label, null] 
    : [val, label];

const isFunction = (val) => type(val) === 'Function'
const isFunctionOrAsyncFunction = pipe(type, (t) => t === 'Function' || t === 'AsyncFunction')
const hasThenFn =
  allPass([ complement(isNil),
            propSatisfies(isFunction, 'then') ]);
const println = (stream, str) => stream.write(`${str}\n`);

const printDuration = (start, color, label) => {
  const end = process.hrtime(start);
  const pre = label ? `${chalk.bold(label)} took ` : '';
  const dur = prettyHrtime(end);
  println(process.stderr, color(pre + dur));
};

//    taim :: label?, Function -> Function
//    taim :: label?, Promise  -> Promise
const taim = (...args) => {
  const color = chalk[nextColor()];
  const [val, label] = getArgs(...args);

  return cond([
    [ hasThenFn, (val) => {
      const start = process.hrtime();
      val.then(() => {
        printDuration(start, color, label);
      });

      return val;
    } ],
    [ isFunctionOrAsyncFunction, (val) =>
      (...args) => {
        const start = process.hrtime();
        const res = val(...args);
        const fn = () => printDuration(start, color, label);

        if (res && hasThenFn(res))
          res.then(fn);
        else
          fn();

        return res;
      }
    ],
    [ T, tap(val => {
      println(process.stderr, `taim error: input should be a async function, function, or thenable, instead got a ${type(val)}`);
    }) ]
  ])(val);
};


//    taimCb :: label?, Function -> Function
const taimCb = (...args) => {
  const color = chalk[nextColor()];
  const [val, label] = getArgs(...args);

  return cond([
    [ isFunction, (val) =>
      (...args) => {
        const origCb = last(args);
        const start = process.hrtime();
        val(...concat(init(args), [ (...cbArgs) => {
          printDuration(start, color, label);
          origCb(...cbArgs);
        } ]));
      }
    ],
    [ T, tap(val => {
      println(process.stderr, `taim error: input should be a function, instead got a ${type(val)}`);
    }) ]
  ])(val);
};

module.exports    = taim;
module.exports.cb = taimCb;
