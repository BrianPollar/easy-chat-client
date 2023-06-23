export class LoggerController {
  private pDebug = console.info.bind(console);
  private pWarn = console.warn.bind(console);
  private pError = console.error.bind(console);
  private pTrace = console.trace.bind(console);

  constructor() {
    /** this.pDebug.log = console.info.bind(console);
    this.pWarn.log = console.warn.bind(console);
    this.pError.log = console.error.bind(console);
    this.pTrace.log = console.trace.bind(console);
    this.pDebug.color = 'blue';
    this.pWarn.color = 'yellow';
    this.pError.color = 'red';
    this.pTrace.color = 'pink';**/
  }

  get debug() {
    return this.pDebug;
  }

  get warn() {
    return this.pWarn;
  }

  get error() {
    return this.pError;
  }

  get trace() {
    return this.pTrace;
  }
}
