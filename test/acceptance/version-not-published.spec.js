const BinRunner = require("./BinRunner");

const fooUnexistantRegistry = "http://foo.com";

describe("version not published", () => {
  it("should exit with code 1 if package and version exists", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-not-published", "version-exists");
    const result = await runner.run();
    expect(result.code).toEqual(1);
  });

  it("should print an advise to upgrade package if package and version exists", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-not-published", "version-exists");
    const result = await runner.run();
    expect(result.logs).toEqual(expect.stringContaining("Please upgrade package version"));
  });

  it("should exit with code 0 if package exists, but version does not exists", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-not-published", "version-not-exists");
    const result = await runner.run();
    expect(result.code).toEqual(0);
  });

  it("should exit with code 0 if package does not exist", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-not-published", "package-not-exists");
    const result = await runner.run();
    expect(result.code).toEqual(0);
  });

  it(
    "should exit with code 1 if npm command returns an error",
    async () => {
      expect.assertions(1);
      const runner = new BinRunner(
        "check-version-not-published",
        "wrong-registry",
        fooUnexistantRegistry
      );
      const result = await runner.run();
      expect(result.code).toEqual(1);
    },
    10000
  );

  it(
    "should print details about the error if npm command returns an error",
    async () => {
      expect.assertions(1);
      const runner = new BinRunner(
        "check-version-not-published",
        "wrong-registry",
        fooUnexistantRegistry
      );
      const result = await runner.run();
      expect(result.logs).toEqual(expect.stringContaining("Error checking version"));
    },
    10000
  );
});
