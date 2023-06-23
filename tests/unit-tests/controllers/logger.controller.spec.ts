import { expect, describe, beforeEach, it } from 'vitest';
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
});
