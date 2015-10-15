const chalk = require('chalk');
const { __, add, allPass, bind, complement, concat, cond, equals, init, isNil, last, pipe, propSatisfies, T, tap, type } = require('ramda');
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

const isFunction = pipe(type, equals('Function'));
const hasThenFn =
  allPass([ complement(isNil),
            propSatisfies(isFunction, 'then') ]);
const writeStderr = bind(process.stderr.write, process.stderr);
const println = pipe(add(__, '\n'), writeStderr);

const printDuration = (start, color, label) => {
  const end = process.hrtime(start);
  const pre = label ? `${chalk.bold(label)} took ` : '';
  const dur = prettyHrtime(end);
  println(color(pre + dur));
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
    [ isFunction, (val) =>
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
      println(`taim error: input should be a function or thenable, instead got a ${type(val)}`);
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
      println(`taim error: input should be a function, instead got a ${type(val)}`);
    }) ]
  ])(val);
};

module.exports    = taim;
module.exports.cb = taimCb;
