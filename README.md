# @alizeait/unflatto ![Check](https://github.com/alizeait/unflatto/workflows/Check/badge.svg) ![Coverage](https://img.shields.io/codecov/c/github/alizeait/unflatto)

> A tiny (~210B) and [fast](#benchmarks) flattened object expander, unflattener

Takes an already flattened object and returns a new nested object by expanding the keys.

It assumes the keys are seperated by a `.` by default but this can be changed to anything with the seperator option.

## Installation

```bash
$ npm install @alizeait/unflatto
```

## Usage

```js
import { unflatto } from "@alizeait/unflatto";

const unflattened = unflatto(
{
  "key1.keyA": "valueI",
  "key2.keyB": "valueII",
  "key3.a.b.c": 2,
  "key4": [],
  "key5.a.0": "value1",
  "key5.a.1": "value2",
  "key5.a.2.key1.keyA": "valueI",
  "key5.a.2.key1.keyB.0": 1,
  "key5.a.2.key1.keyB.1": 2,
  "key5.a.2.key1.keyB.2": 3,
  "key5.a.2.key1.keyB.3": 4,
  "key5.b": null,
  "key5.c": undefined,
  "key6": {}
}

/*
{
  key1: {
    keyA: "valueI",
  },
  key2: {
    keyB: "valueII",
  },
  key3: { a: { b: { c: 2 } } },
  key4: [],
  key5: {
    a: [
      "value1",
      "value2",
      {
        key1: {
          keyA: "valueI",
          keyB: [1, 2, 3, 4],
        },
      },
    ],
    b: null,
    c: undefined,
  },
  key6: {},
});
  */

const unflattoCustom = unflatto({
  "key1-keyA": "valueI",
  "key2-keyB": "valueII",
  "key3-a-b-c": 2,
},"-");

/*
  {
    key1: {
      keyA: "valueI",
    },
    key2: {
      keyB: "valueII",
    },
    key3: { a: { b: { c: 2 } } },
  }
*/
```

## Benchmarks

```
Benchmarks:

  flat.unflatten               x 63,827 ops/sec ±0.95% (89 runs sampled)
  @alizeait/unflatto           x 208,279 ops/sec ±0.84% (93 runs sampled)
  obj-unflatten                x 168,569 ops/sec ±0.68% (92 runs sampled)
```

> Running on Node.js v12.13.0, 64-bit OS, Intel(R) Core(TM) i5-6600K CPU @ 3.50GHz, 16.0 GB RAM

## Validation

```
Validation:

flat.unflatten               ✔
@alizeait/unflatto           ✔
obj-unflatten                ✘
  Wrongly expands arrays
```

## API

### unflatto(input: Object, seperator?:string)

Returns: `Object` | `Array`

Returns a new expanded object/array.
