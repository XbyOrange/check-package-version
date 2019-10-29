const path = require("path");

const sinon = require("sinon");

const versionInChangelog = require("../../../../lib/checks/versionInChangelog");
const changelogIncludesVersion = require("../../../../lib/changelogIncludesVersion");

const packageInfo = require(path.resolve(__dirname, "..", "..", "..", "..", "package.json"));

describe("versionInChangelog check method", () => {
  let sandbox;
  let originalExitCode;
  let changelogIncludesVersionStub;

  beforeEach(() => {
    originalExitCode = process.exitCode;
    sandbox = sinon.createSandbox();
    sandbox.stub(console, "log");
    changelogIncludesVersionStub = sandbox
      .stub(changelogIncludesVersion, "check")
      .usingPromise()
      .resolves();
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    sandbox.restore();
  });

  test("should call to changelogIncludesVersion check method, passing package version from package.json file, and CHANGELOG.md path from current cwd", async () => {
    expect.assertions(2);
    await versionInChangelog.check();
    const changelogIncludesVersionCall = changelogIncludesVersion.check.getCall(0);
    expect(changelogIncludesVersionCall.args[0]).toEqual(packageInfo.version);
    expect(changelogIncludesVersionCall.args[1]).toEqual(
      path.resolve(__dirname, "..", "..", "..", "..", "CHANGELOG.md")
    );
  });

  test("should mark the process to exit with code 1 if changelogIncludesVersion returns false", async () => {
    expect.assertions(1);
    changelogIncludesVersionStub.resolves(false);
    await versionInChangelog.check();
    expect(process.exitCode).toEqual(1);
  });

  test("should print an advise to add documentation if changelogIncludesVersion returns false", async () => {
    expect.assertions(1);
    changelogIncludesVersionStub.resolves(false);
    await versionInChangelog.check();
    expect(console.log.getCall(1).args[0]).toEqual(
      expect.stringContaining("Please add an entry for this version")
    );
  });

  test("should print a confirmation informing that changelog contains version if changelogIncludesVersion returns true", async () => {
    expect.assertions(1);
    changelogIncludesVersionStub.resolves(true);
    await versionInChangelog.check();
    expect(console.log.getCall(1).args[0]).toEqual(
      expect.stringContaining("is defined in the CHANGELOG.md")
    );
  });

  test("should mark the process to exit with code 1 if changelogIncludesVersion throws an error", async () => {
    expect.assertions(1);
    changelogIncludesVersionStub.rejects(new Error());
    await versionInChangelog.check();
    expect(process.exitCode).toEqual(1);
  });

  test("should print details about the error if changelogIncludesVersion throws an error", async () => {
    const fooErrorMessage = "Foo error message";
    expect.assertions(1);
    changelogIncludesVersionStub.rejects(new Error(fooErrorMessage));
    await versionInChangelog.check();
    expect(console.log.getCall(1).args[0]).toEqual(expect.stringContaining(fooErrorMessage));
  });

  test("should call to changelogIncludesVersion check method, passing package version from stubed package.json, and CHANGELOG.md stubed path", async () => {
    expect.assertions(2);

    const fakeJSON = path.resolve(__dirname, "..", "..", "fixtures", "package-custom-path");
    const fakePackage = require(path.resolve(fakeJSON, "package.json"));

    await versionInChangelog.check(fakeJSON);

    const changelogIncludesVersionCall = changelogIncludesVersion.check.getCall(0);
    expect(changelogIncludesVersionCall.args[0]).toEqual(fakePackage.version);
    expect(changelogIncludesVersionCall.args[1]).toEqual(
      path.resolve(__dirname, "..", "..", "fixtures", "package-custom-path", "CHANGELOG.md")
    );
  });
});
