const childProcess = require("child_process");

const sinon = require("sinon");

const CallBackRunnerFake = class CallBackRunnerFake {
  constructor(options = {}) {
    this._options = options;
    this._cbs = [];
    this.fake = this.fake.bind(this);
    this.returns = this.returns.bind(this);
    this.runOnRegister = this.runOnRegister.bind(this);
    this.run = this.run.bind(this);
  }

  fake(eventName, cb) {
    if (this._options.runOnRegister) {
      cb(this._options.returns);
    }
    this._cbs.push(cb);
  }

  returns(code) {
    this._options.returns = code;
  }

  runOnRegister(run) {
    this._options.runOnRegister = run;
  }

  run() {
    this._cbs.forEach(cb => cb(data));
  }
};

module.exports = class Mock {
  constructor() {
    this._sandbox = sinon.createSandbox();

    this._stdoutOnFake = new CallBackRunnerFake({
      runOnRegister: true
    });
    this._stderrOnFake = new CallBackRunnerFake();
    this._onFake = new CallBackRunnerFake({
      runOnRegister: true,
      returns: 0
    });

    this._stub = this._sandbox.stub(childProcess, "spawn").returns({
      stdout: {
        setEncoding: this._sandbox.stub(),
        on: this._stdoutOnFake.fake
      },
      stderr: {
        setEncoding: this._sandbox.stub(),
        on: this._stderrOnFake.fake
      },
      on: this._onFake.fake
    });

    this._stub.stdout = {
      on: {
        returns: this._stdoutOnFake.returns,
        runOnRegister: this._stdoutOnFake.runOnRegister,
        run: this._stdoutOnFake.run
      }
    };

    this._stub.stderr = {
      on: {
        returns: this._stderrOnFake.returns,
        runOnRegister: this._stderrOnFake.runOnRegister,
        run: this._stderrOnFake.run
      }
    };

    this._stub.on = {
      fake: this._onFake.fake,
      returns: this._onFake.returns,
      runOnRegister: this._onFake.runOnRegister,
      run: this._onFake.run
    };
  }

  get stub() {
    return this._stub;
  }

  restore() {
    this._sandbox.restore();
  }
};
