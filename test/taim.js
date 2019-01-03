const test = require('tape')
const rewire = require('rewire')
const stream = require('stream')
const { always } = require('ramda')
const Promise = require('bluebird')

const setup = (cb) => {
  const taim = rewire('../lib')
  const out = new stream.PassThrough()
  out.on('data', (data) => {
    cb((data.toString()))
  })

  taim.__set__('process', {
    hrtime: always([0, 1.004e8]), // 100 ms
    stderr: out
  })

  return taim
}

test('function', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m100 ms\u001b[39m\n')
    t.end()
  }

  const foo = always('foo')
  const taim = setup(cb)
  t.equal(taim(foo)(), 'foo')
})

test('function with label', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m\u001b[1mfoo\u001b[22m took 100 ms\u001b[39m\n')
    t.end()
  }

  const foo = always('foo')
  const taim = setup(cb)
  t.equal(taim('foo', foo)(), 'foo')
})

test('promise-returning function', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m100 ms\u001b[39m\n')
    t.end()
  }

  const fn = always(Promise.resolve('foo'))
  const taim = setup(cb)
  taim(fn)().then(res => t.equal(res, 'foo'))
})

test('async function', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m100 ms\u001b[39m\n')
    t.end()
  }
  const fn = async () => "foo"
  const taim = setup(cb)
  taim(fn)().then(res => t.equal(res, 'foo'))
})

test('promise', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m100 ms\u001b[39m\n')
    t.end()
  }

  const p = Promise.resolve('foo')
  const taim = setup(cb)
  taim(p).then(res => t.equal(res, 'foo'))
})

test('promise with label', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m\u001b[1mpromise\u001b[22m took 100 ms\u001b[39m\n')
    t.end()
  }

  const p = Promise.resolve('foo')
  const taim = setup(cb)
  taim('promise', p).then(res => t.equal(res, 'foo'))
})

test('callback', (t) => {
  const cb = (out) => {
    t.equal(out, '\u001b[32m100 ms\u001b[39m\n')
    t.end()
  }

  const fn = (cb) =>
    cb(null, 'foo')

  const taim = setup(cb)
  taim.cb(fn)((err, res) => t.equal(res, 'foo'))
})

test('bad input error', (t) => {
  const cb = (out) => {
    t.equal(out, 'taim error: input should be a async function, function, or thenable, instead got a Object\n')
    t.end()
  }

  const taim = setup(cb)
  taim({})
})
