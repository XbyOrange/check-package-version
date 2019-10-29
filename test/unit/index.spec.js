const index = require("../../index");

describe("index", () => {
  it("should have checkVersion method", () => {
    expect(typeof index.checkVersion).toEqual("function");
  });

  it("should have checkChangelog method", () => {
    expect(typeof index.checkChangelog).toEqual("function");
  });

  it("should have checkAll method", () => {
    expect(typeof index.checkAll).toEqual("function");
  });
});
