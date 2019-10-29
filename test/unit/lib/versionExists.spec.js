const sinon = require("sinon");

const ChildProcessMock = require("./ChildProcess.mocks");

const versionExists = require("../../../lib/versionExists");

describe("versionExists check method", () => {
  const fooPackage = "foo-package";
  const fooVersion = "foo-version";
  let sandbox;
  let childProcessMock;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    childProcessMock = new ChildProcessMock();
    sandbox.stub(console, "log");
  });

  afterEach(() => {
    childProcessMock.restore();
    sandbox.restore();
  });

  it("should call to npm view command with provided package name and version", async () => {
    expect.assertions(2);

    await versionExists.check(fooPackage, fooVersion);
    const spawnCall = childProcessMock.stub.getCall(0);

    expect(spawnCall.args[0]).toEqual("npm");
    expect(spawnCall.args[1]).toEqual(["view", `${fooPackage}@${fooVersion}`]);
  });

  it("should add custom cwd option to npm invocation", async () => {
    const fooCwd = "foo-cwd";
    expect.assertions(1);

    await versionExists.check(fooPackage, fooVersion, {
      cwd: fooCwd
    });
    const spawnCall = childProcessMock.stub.getCall(0);

    expect(spawnCall.args[2].cwd).toEqual(fooCwd);
  });

  it("should log all received data from npm stdout if log option is received", async () => {
    const fooStdout = "foo-stdout";
    expect.assertions(1);

    childProcessMock.stub.stdout.on.returns(fooStdout);

    await versionExists.check(fooPackage, fooVersion, {
      log: true
    });
    const consoleOut = console.log.getCall(0).args[0];
    expect(consoleOut).toEqual(fooStdout);
  });

  it("should log all received data from npm stderr if log option is received", async () => {
    const fooStderr = "foo-stderr";
    expect.assertions(1);

    childProcessMock.stub.stderr.on.returns(fooStderr);
    childProcessMock.stub.stderr.on.runOnRegister(true);

    await versionExists.check(fooPackage, fooVersion, {
      log: true
    });
    const consoleOut = console.log.getCall(0).args[0];
    expect(consoleOut).toEqual(fooStderr);
  });

  it("should log all received data from npm stderr and stdout if log option is received", async () => {
    const fooStdout = "foo-stdout";
    const fooStderr = "foo-stderr";
    expect.assertions(1);

    childProcessMock.stub.stdout.on.returns(fooStdout);
    childProcessMock.stub.stderr.on.returns(fooStderr);
    childProcessMock.stub.stderr.on.runOnRegister(true);

    await versionExists.check(fooPackage, fooVersion, {
      log: true
    });
    const consoleOut = console.log.getCall(0).args[0];
    expect(consoleOut).toEqual(`${fooStdout}${fooStderr}`);
  });

  it("should not log received data from npm stdout or stderr if log option is not received", async () => {
    const fooStdout = "foo-stdout";
    const fooStderr = "foo-stderr";
    expect.assertions(1);

    childProcessMock.stub.stdout.on.returns(fooStdout);
    childProcessMock.stub.stderr.on.returns(fooStderr);
    childProcessMock.stub.stderr.on.runOnRegister(true);

    await versionExists.check(fooPackage, fooVersion);
    const consoleOut = console.log.getCalls();
    expect(consoleOut.length).toEqual(0);
  });

  describe("when npm command finish without error", () => {
    it("should return true if npm process return logs", async () => {
      const fooStdout = "foo-stdout";
      expect.assertions(1);

      childProcessMock.stub.stdout.on.returns(fooStdout);

      const result = await versionExists.check(fooPackage, fooVersion);
      expect(result).toBe(true);
    });

    it("should return false if npm process doesn't return logs", async () => {
      const fooStdout = "";
      expect.assertions(1);

      childProcessMock.stub.stdout.on.returns(fooStdout);

      const result = await versionExists.check(fooPackage, fooVersion);
      expect(result).toBe(false);
    });
  });

  describe("when npm command finish with error", () => {
    it("should return false if npm process logs include 404 string", async () => {
      const fooStderr = "foo-stderr 404";
      expect.assertions(1);

      childProcessMock.stub.stderr.on.returns(fooStderr);
      childProcessMock.stub.stderr.on.runOnRegister(true);
      childProcessMock.stub.on.returns(1);

      const result = await versionExists.check(fooPackage, fooVersion);
      expect(result).toBe(false);
    });

    it("should throw an error if npm process logs don't include 404", async () => {
      const fooStderr = "foo-stderr";
      expect.assertions(1);

      childProcessMock.stub.stderr.on.returns(fooStderr);
      childProcessMock.stub.stderr.on.runOnRegister(true);
      childProcessMock.stub.on.returns(1);

      try {
        await versionExists.check(fooPackage, fooVersion);
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining(`${fooPackage}@${fooVersion}`));
      }
    });
  });
});
