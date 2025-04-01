/* eslint-disable @typescript-eslint/ban-ts-comment */
const mock = require("../mock");
const { unflatto } = require("../src");

describe("unflatto", () => {
  test("should unflatten correctly", () => {
    expect(unflatto(mock)).toMatchSnapshot();
  });
  test("should unflatten with correct seperator", () => {
    const data = {
      "key1-a": 2,
      "key2-b": 3,
    };
    expect(unflatto(data, "-")).toEqual({ key1: { a: 2 }, key2: { b: 3 } });
    expect(unflatto(mock)).toMatchSnapshot();
  });
  test("should keep falsy values", () => {
    const data = {
      "key1.a": false,
      "key2.b": null,
      "key3.c": 0,
      "key4.d.e": "",
      "key5.f.g": undefined,
      "key6.h.i": NaN,
    };
    expect(unflatto(data)).toEqual({
      key1: { a: false },
      key2: { b: null },
      key3: { c: 0 },
      key4: { d: { e: "" } },
      key5: { f: { g: undefined } },
      key6: { h: { i: NaN } },
    });
  });
  test("should unflatten arrays correctly", () => {
    const data = {
      "0": false,
      "1": null,
      "2": 0,
      "3": "",
      "4": undefined,
      "5": NaN,
    };
    expect(unflatto(data)).toEqual([false, null, 0, "", undefined, NaN]);
    expect(unflatto(data)).toMatchSnapshot();
  });
});

describe("unflatto prototype pollution tests", () => {
  beforeEach(() => {
    // Reset Object prototype properties that might have been polluted
    //@ts-ignore
    delete Object.prototype.polluted;
    //@ts-ignore
    delete Object.prototype.injected;
    //@ts-ignore
    delete Array.prototype.polluted;
  });

  test("should protect against direct __proto__ pollution", () => {
    // Attempt direct pollution through __proto__
    const input = {
      "__proto__.polluted": "dangerous",
    };

    unflatto(input);

    // Verify Object prototype wasn't polluted
    //@ts-ignore
    expect(Object.prototype.polluted).toBeUndefined();
    //@ts-ignore
    expect({}.polluted).toBeUndefined();
  });

  test("should protect against direct prototype pollution", () => {
    // Attempt direct pollution through prototype
    const input = {
      "prototype.injected": "exploit",
    };

    unflatto(input);

    // Verify Object prototype wasn't polluted
    //@ts-ignore
    expect(Object.prototype.injected).toBeUndefined();
    //@ts-ignore
    expect({}.injected).toBeUndefined();
  });

  test("should protect against direct constructor pollution", () => {
    // Attempt pollution through constructor
    const input = {
      "constructor.prototype.dangerous": "exploit",
    };

    unflatto(input);

    // Verify Object prototype wasn't polluted
    //@ts-ignore
    expect(Object.prototype.dangerous).toBeUndefined();
    //@ts-ignore
    expect({}.dangerous).toBeUndefined();
  });

  test("should protect against nested __proto__ pollution", () => {
    // Attempt nested pollution
    const input = {
      "nested.__proto__.polluted": "danger",
    };

    const result = unflatto(input);

    // Verify result structure is correct but prototype wasn't polluted
    expect(result).toEqual({ nested: {} });
    //@ts-ignore
    expect(Object.prototype.polluted).toBeUndefined();
    //@ts-ignore
    expect({}.polluted).toBeUndefined();
  });

  test("should protect against array-based __proto__ pollution", () => {
    // Attempt pollution through numeric keys (which creates arrays)
    const input = {
      "0.__proto__.polluted": "danger",
    };

    unflatto(input);

    //@ts-ignore
    expect(Array.prototype.polluted).toBeUndefined();
    //@ts-ignore
    expect([].polluted).toBeUndefined();
  });

  test("should protect against complex nested pollution attempts", () => {
    // Complex nested pollution attempt
    const input = {
      "a.b.c.__proto__.polluted": "danger",
      "x.y.constructor.prototype.injected": "exploit",
      "deep.nested.prototype.bad": "value",
    };

    const result = unflatto(input);

    expect(result).toEqual({
      a: { b: { c: {} } },
      x: { y: {} },
      deep: { nested: {} },
    });

    //@ts-ignore
    expect(Object.prototype.polluted).toBeUndefined();
    //@ts-ignore
    expect(Object.prototype.injected).toBeUndefined();
    //@ts-ignore
    expect(Object.prototype.bad).toBeUndefined();
  });

  test("should handle mixed safe and unsafe paths correctly", () => {
    // Mix of safe and unsafe paths
    const input = {
      "safe.path": "good",
      "unsafe.__proto__.bad": "evil",
      "another.safe.path": 123,
      "mixed.constructor.valid": "should-not-work",
    };

    const result = unflatto(input);

    // Verify safe paths were processed but unsafe were blocked
    expect(result).toEqual({
      safe: { path: "good" },
      unsafe: {},
      another: { safe: { path: 123 } },
      mixed: {},
    });

    //@ts-ignore
    expect(Object.prototype.bad).toBeUndefined();
    //@ts-ignore
    expect({}.bad).toBeUndefined();
  });

  test("should handle custom separators correctly", () => {
    // Attempt pollution with custom separator
    const input = {
      "a|b|__proto__|polluted": "danger",
    };

    const result = unflatto(input, "|");

    expect(result).toEqual({ a: { b: {} } });
    //@ts-ignore
    expect(Object.prototype.polluted).toBeUndefined();
  });
});
