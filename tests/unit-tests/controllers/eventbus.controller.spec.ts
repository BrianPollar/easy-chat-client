import { expect, describe, beforeEach, it } from 'vitest';
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

  it('should effectively listent to socket$', () => {
    let val;
    const subS = instance.socket$.subscribe(sub => {
      val = sub;
    });

    const nxtEvent = {
      type: 'test',
      data: 'test'
    } as any;
    instance.socket$.next(nxtEvent);
    expect(val).toBeDefined();
    expect(val).toHaveProperty('type');
    expect(val).toHaveProperty('data');
    subS.unsubscribe();
  });

  it('should effectively listent to chat$', () => {
    let val;
    const subS = instance.chat$.subscribe(sub => {
      val = sub;
    });

    const nxtEvent = {
      type: 'test',
      data: 'test'
    } as any;
    instance.chat$.next(nxtEvent);
    expect(val).toBeDefined();
    expect(val).toHaveProperty('type');
    expect(val).toHaveProperty('data');
    subS.unsubscribe();
  });

  it('should effectively listent to userOnlineChange$', () => {
    let val;
    const subS = instance.userOnlineChange$.subscribe(sub => {
      val = sub;
    });
    const nxtEvent = {
      type: 'test',
      data: 'test'
    } as any;
    instance.userOnlineChange$.next(nxtEvent);
    expect(val).toHaveProperty('type');
    expect(val).toHaveProperty('data');
    subS.unsubscribe();
  });

  it('should effectively listent to outEvent', () => {
    let val;
    const subS = instance.outEvent.subscribe(sub => {
      val = sub;
    });
    const nxtEvent = {
      type: 'test',
      data: 'test'
    } as any;
    instance.outEvent.next(nxtEvent);
    expect(val).toHaveProperty('type');
    expect(val).toHaveProperty('data');
    subS.unsubscribe();
  });
});
