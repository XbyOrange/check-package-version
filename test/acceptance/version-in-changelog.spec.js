const BinRunner = require("./BinRunner");

describe("version in changelog", () => {
  it("should exit with code 0 if version is defined in changelog", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-in-changelog", "changelog-includes");
    const result = await runner.run();
    expect(result.code).toEqual(0);
  });

  it("should exit with code 1 if version is not defined in changelog", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-in-changelog", "changelog-not-includes");
    const result = await runner.run();
    expect(result.code).toEqual(1);
  });

  it("should print an advise to add documentation if version is not defined in changelog", async () => {
    expect.assertions(1);
    const runner = new BinRunner("check-version-in-changelog", "changelog-not-includes");
    const result = await runner.run();
    expect(result.logs).toEqual(expect.stringContaining("Please add an entry for this version"));
  });

  it(
    "should exit with code 1 if readFile returns an error",
    async () => {
      expect.assertions(1);
      const runner = new BinRunner("check-version-in-changelog", "changelog-wrong");
      const result = await runner.run();
      expect(result.code).toEqual(1);
    },
    10000
  );

  it(
    "should print details about the error if readFile returns an error",
    async () => {
      expect.assertions(1);
      const runner = new BinRunner("check-version-in-changelog", "changelog-wrong");
      const result = await runner.run();
      expect(result.logs).toEqual(expect.stringContaining("Error checking changelog"));
    },
    10000
  );
});
