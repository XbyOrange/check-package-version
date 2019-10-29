const sinon = require("sinon");

const all = require("../../../../lib/checks/all");
const versionNoPublished = require("../../../../lib/checks/versionNotPublished");
const versionInChangelog = require("../../../../lib/checks/versionInChangelog");

describe("check all method", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(versionNoPublished, "check")
      .usingPromise()
      .resolves();
    sandbox
      .stub(versionInChangelog, "check")
      .usingPromise()
      .resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should call to versionNoPublished check method", async () => {
    expect.assertions(1);
    await all.check();
    expect(versionNoPublished.check.getCalls().length).toEqual(1);
  });

  it("should call to 'versionInChangelog' check method", async () => {
    expect.assertions(1);
    versionNoPublished.check.resolves(false);

    await all.check();
    expect(versionInChangelog.check.getCalls().length).toEqual(1);
  });

  it("should return 'true' when all internal calls are trusty", async () => {
    versionNoPublished.check.resolves(true);
    versionInChangelog.check.resolves(true);

    const result = await all.check();

    expect.assertions(1);
    expect(result).toBe(true);
  });

  it("should return 'false' when at least 'versionNoPublished' returns falsy", async () => {
    versionNoPublished.check.resolves(false);
    versionInChangelog.check.resolves(true);

    const result = await all.check();

    expect.assertions(1);
    expect(result).toBe(false);
  });

  it("should return 'false' when at least 'versionInChangelog' returns falsy", async () => {
    versionNoPublished.check.resolves(true);
    versionInChangelog.check.resolves(false);

    const result = await all.check();

    expect.assertions(1);
    expect(result).toBe(false);
  });
});
