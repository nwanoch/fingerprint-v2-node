const express = require("express");
const { equal } = require("assert");
const {
  load,
  DataType,
  open,
  close,
  arrayConstructor,
  define,
} = require("ffi-rs");
const app = express();
const port = 3000;

app.get("/", (req, resp) => {
  const a = 1;
  const b = 99;
  const dynamicLib = "./libsum.so";

  try {
    open({
      library: "libsum",
      path: dynamicLib,
    });
    console.log("Library opened successfully");

    const r = load({
      library: "libsum",
      funcName: "sum",
      retType: DataType.I32,
      paramsType: [DataType.I32, DataType.I32],
      paramsValue: [a, b],
    });
    console.log(`Result of sum(${a}, ${b}): ${r}`);

    equal(r, a + b);
    console.log("Assertion passed: r == a + b");

    const res = define({
      sum: {
        library: "libsum",
        retType: DataType.I32,
        paramsType: [DataType.I32, DataType.I32],
      },
    });

    const defineResult = res.sum([1, 2]);
    console.log(`Result of define sum(1, 2): ${defineResult}`);

    equal(defineResult, 3);
    console.log("Assertion passed: defineResult == 3");

    resp.json({
      message: "Hello ffi",
      sumResult: r,
      defineResult: defineResult,
    });
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ error: error.message });
  } finally {
    close("libsum");
    console.log("Library closed");
  }
});

app.get("/iengine", (req, resp) => {
  resp.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
