const path = require("path");

const sinon = require("sinon");

const versionNotPublished = require("../../../../lib/checks/versionNotPublished");
const versionExists = require("../../../../lib/versionExists");

const packageInfo = require(path.resolve(__dirname, "..", "..", "..", "..", "package.json"));

describe("versionNotPublished check method", () => {
  let sandbox;
  let versionExistsStub;
  let originalExitCode;

  beforeEach(() => {
    originalExitCode = process.exitCode;
    sandbox = sinon.createSandbox();
    sandbox.stub(console, "log");
    versionExistsStub = sandbox
      .stub(versionExists, "check")
      .usingPromise()
      .resolves();
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    sandbox.restore();
  });

  test("should call to versionExists check method, passing package data from package.json file in current cwd", async () => {
    expect.assertions(2);
    await versionNotPublished.check();
    const versionExistsCall = versionExists.check.getCall(0);

    expect(versionExistsCall.args[0]).toEqual(packageInfo.name);
    expect(versionExistsCall.args[1]).toEqual(packageInfo.version);
  });

  test("should mark the process to exit with code 1 if versionExists returns true", async () => {
    expect.assertions(1);
    versionExistsStub.resolves(true);
    await versionNotPublished.check();
    expect(process.exitCode).toEqual(1);
  });

  test("should print an advise to upgrade package if versionExists returns true", async () => {
    expect.assertions(1);
    versionExistsStub.resolves(true);
    await versionNotPublished.check();

    expect(console.log.getCall(1).args[0]).toEqual(
      expect.stringContaining("Please upgrade package version")
    );
  });

  test("should print a confirmation informing that package does not exists if versionExists returns false", async () => {
    expect.assertions(1);
    versionExistsStub.resolves(false);
    await versionNotPublished.check();
    expect(console.log.getCall(1).args[0]).toEqual(
      expect.stringContaining("is not already published")
    );
  });

  test("should mark the process to exit with code 1 if versionExists throws an error", async () => {
    expect.assertions(1);
    versionExistsStub.rejects(new Error());
    await versionNotPublished.check();
    expect(process.exitCode).toEqual(1);
  });

  test("should print details about the error if versionExists throws an error", async () => {
    const fooErrorMessage = "Foo error message";
    expect.assertions(1);
    versionExistsStub.rejects(new Error(fooErrorMessage));
    await versionNotPublished.check();
    expect(console.log.getCall(1).args[0]).toEqual(expect.stringContaining(fooErrorMessage));
  });

  test("should call to versionExists check method, passing package data from stubed package.json", async () => {
    expect.assertions(2);

    const fakeJSON = path.resolve(__dirname, "..", "..", "fixtures", "package-custom-path");
    const fakePackage = require(path.resolve(fakeJSON, "package.json"));

    await versionNotPublished.check(fakeJSON);
    const versionExistsCall = versionExists.check.getCall(0);

    expect(versionExistsCall.args[0]).toEqual(fakePackage.name);
    expect(versionExistsCall.args[1]).toEqual(fakePackage.version);
  });
});
