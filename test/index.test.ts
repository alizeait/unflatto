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
