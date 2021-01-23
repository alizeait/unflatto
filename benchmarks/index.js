const { Suite } = require("benchmark");
const assert = require("assert");
const mock = require("../mock");
const moduleNames = {
  "flat.unflatten": require("flat").unflatten,
  "@alizeait/unflatto": require("../dist").unflatto,
  "obj-unflatten": require("obj-unflatten"),
};

console.log("Benchmarks:\n");
const bench = new Suite().on("cycle", (e) => {
  console.log("  " + e.target);
});

Object.keys(moduleNames).forEach((moduleName) => {
  bench.add(moduleName + " ".repeat(28 - moduleName.length), () => {
    moduleNames[moduleName](mock);
  });
});
bench.run();

console.log("\nValidation:\n");
Object.keys(moduleNames).forEach((moduleName) => {
  try {
    const result = moduleNames[moduleName](mock);
    assert.strictEqual(result.key1.keyA, "valueI", "Wrongly expands object");
    assert.strictEqual(
      typeof result.key3.a.b.c,
      "number",
      "Wrongly expands object"
    );
    assert.strictEqual(
      Array.isArray(result.key5.a),
      true,
      "Wrongly expands arrays"
    );
    console.log(moduleName + " ".repeat(28 - moduleName.length), "✔");
  } catch (error) {
    console.log(moduleName + " ".repeat(28 - moduleName.length), "✘");
    console.log("  " + error.message + "\n");
  }
});
