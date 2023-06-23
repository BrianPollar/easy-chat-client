import { vi, expect, describe, beforeEach, it } from 'vitest';
import { EventbusController } from '../../../src/controllers/eventbus.controller';

describe('EventbusController', () => {
  let instance: EventbusController;

  beforeEach(() => {
    instance = new EventbusController();
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(EventbusController);
  });

  it('should get the current stockAuthClientInstance', () => {
    expect(instance.socket$).toBeDefined();
    expect(instance.chat$).toBeDefined();
    expect(instance.userOnlineChange$).toBeDefined();
    expect(instance.outEvent).toBeDefined();
  });
});
