const fs = require("fs");

const sinon = require("sinon");

const changelogIncludesVersion = require("../../../lib/changelogIncludesVersion");

const ReadFileMock = class ReadFileMock {
  constructor() {
    this.stub = this.stub.bind(this);
  }

  set error(error) {
    this._error = error;
  }

  set result(result) {
    this._result = result;
  }

  stub(filePath, encoding, cb) {
    cb(this._error, this._result);
  }
};

describe("changelogIncludesVersion check method", () => {
  const fooChangelogPath = "foo-changelog-path";
  const fooVersion = "foo-version";
  let sandbox;
  let readFileMock;
  let readFileStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    readFileMock = new ReadFileMock();
    readFileStub = sandbox.stub(fs, "readFile").callsFake(readFileMock.stub);
    sandbox.stub(console, "log");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should call to read file with provided changeLog path", async () => {
    expect.assertions(1);
    readFileMock.result = "foo-result";
    await changelogIncludesVersion.check(fooVersion, fooChangelogPath);
    expect(readFileStub.getCall(0).args[0]).toEqual(fooChangelogPath);
  });

  it("should throw an error with detailed message if readFile throws an error", async () => {
    const fooErrorMessage = "foo-error";
    expect.assertions(2);
    readFileMock.error = new Error(fooErrorMessage);
    try {
      await changelogIncludesVersion.check(fooVersion, fooChangelogPath);
    } catch (error) {
      expect(error.message).toEqual(expect.stringContaining(fooErrorMessage));
      expect(error.message).toEqual(expect.stringContaining("Error reading CHANGELOG.md"));
    }
  });

  it("should return true if returned data contains provided version", async () => {
    expect.assertions(1);
    readFileMock.result = "Foo text with [foo-version] inside";
    const result = await changelogIncludesVersion.check(fooVersion, fooChangelogPath);
    expect(result).toEqual(true);
  });

  it("should return false if returned data does not contain provided version", async () => {
    expect.assertions(1);
    readFileMock.result = "Foo text with [another-version] inside";
    const result = await changelogIncludesVersion.check(fooVersion, fooChangelogPath);
    expect(result).toEqual(false);
  });
});
