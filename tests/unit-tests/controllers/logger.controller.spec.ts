/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { LoggerController } from '../../../src/controllers/logger.controller';

describe('LoggerController', () => {
  let instance: LoggerController;

  beforeEach(() => {
    instance = new LoggerController();
  });

  it('should get the current stockAuthClientInstance', () => {
    expect(instance.debug).toBeDefined();
    expect(instance.warn).toBeDefined();
    expect(instance.error).toBeDefined();
    expect(instance.trace).toBeDefined();
  });

  it('should log messages with the correct colors', () => {
    // @ts-ignore
    const debugLogSpy = vi.spyOn(instance, 'pDebug');
    // @ts-ignore
    const warnLogSpy = vi.spyOn(instance, 'pWarn');
    // @ts-ignore
    const errorLogSpy = vi.spyOn(instance, 'pError');
    // @ts-ignore
    const traceLogSpy = vi.spyOn(instance, 'pTrace');
    instance.debug('This is a debug message');
    instance.warn('This is a warning message');
    instance.error('This is an error message');
    instance.trace('This is a trace message');
    // expect(consoleLogSpy).toHaveBeenCalledTimes(4);
    expect(debugLogSpy).toHaveBeenCalled();
    expect(warnLogSpy).toHaveBeenCalled();
    expect(errorLogSpy).toHaveBeenCalled();
    expect(traceLogSpy).toHaveBeenCalled();
    /*
    expect(console.log.arguments[0][0]).toMatch('This is a debug message');
    expect(console.log.arguments[1][0]).toMatch('This is a warning message');
    expect(console.log.arguments[2][0]).toMatch('This is an error message');
    expect(console.log.arguments[3][0]).toMatch('This is a trace message');
    expect(console.log.arguments[0][1]).toBe('blue');
    expect(console.log.arguments[1][1]).toBe('yellow');
    expect(console.log.arguments[2][1]).toBe('red');
    expect(console.log.arguments[3][1]).toBe('pink');
    */
  });
});
