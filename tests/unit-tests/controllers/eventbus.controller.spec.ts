import { expect, describe, beforeEach, it, afterEach } from 'vitest';
import { EventbusController, IchatEvent, IoutEvent, IsocketEvent } from '../../../src/controllers/eventbus.controller';
import { ECHATMETHOD } from '../../../src/enums/chat.enum';
import { BehaviorSubject } from 'rxjs';

describe('EventbusController', () => {
  let instance: EventbusController;
  let subMain;

  beforeEach(() => {
    instance = new EventbusController();
  });

  afterEach(() => {
    if (subMain) {
      subMain.unsubscribe();
    }
  });

  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(EventbusController);
  });

  it('should all props be instance of behavour subject', () => {
    expect(instance.socket$).toBeInstanceOf(BehaviorSubject);
    expect(instance.chat$).toBeInstanceOf(BehaviorSubject);
    expect(instance.userOnlineChange$).toBeInstanceOf(BehaviorSubject);
    expect(instance.outEvent).toBeInstanceOf(BehaviorSubject);
  });

  it('should get the current stockAuthClientInstance', () => {
    expect(instance.socket$).toBeDefined();
    expect(instance.chat$).toBeDefined();
    expect(instance.userOnlineChange$).toBeDefined();
    expect(instance.outEvent).toBeDefined();
  });

  it('should effectively listent to socket$', () => new Promise(done => {
    let val: IsocketEvent | null;
    const nxtEvent = {
      type: 'test',
      data: 'test'
    };
    instance.socket$.subscribe(sub => {
      val = sub;
      if (!val) {
        // first behaviour
        expect(sub).toBe(null);
      }
      if (sub && sub.type && sub.data) {
        // second behaviour
        expect(sub).toBeDefined();
        expect(sub).toHaveProperty('type');
        expect(sub).toHaveProperty('data');
        expect(sub).toStrictEqual(nxtEvent);
        done(null);
      }
    });
    instance.socket$.next(nxtEvent);
  }));

  it('should effectively listent to chat$', () => new Promise(done => {
    let val: IchatEvent | null;
    const nxtEvent = {
      type: ECHATMETHOD.NEW_PEER,
      data: 'test'
    };
    instance.chat$.subscribe(sub => {
      val = sub;
      if (!val) {
        // first behaviour
        expect(sub).toBe(null);
      }
      if (sub && sub.type && sub.data) {
        // second behaviour
        expect(sub).toBeDefined();
        expect(sub).toHaveProperty('type');
        expect(sub).toHaveProperty('data');
        expect(sub).toStrictEqual(nxtEvent);
        done(null);
      }
    });
    instance.chat$.next(nxtEvent);
  }));

  it('should effectively listent to userOnlineChange$', () => new Promise(done => {
    let val: boolean;
    instance.userOnlineChange$.subscribe(sub => {
      val = sub;
      if (!val) {
        // first behaviour
        expect(sub).toBe(null);
      }
      if (sub) {
        // second behaviour
        expect(typeof val).toBe('boolean');
        expect(val).toBe(true);
        done(null);
      }
    });
    instance.userOnlineChange$.next(true);
  }));

  it('should effectively listent to outEvent', () => new Promise(done => {
    let val: IoutEvent | null;
    const nxtEvent = {
      type: 'test',
      data: 'test'
    };
    instance.outEvent.subscribe(sub => {
      val = sub;
      if (!val) {
        // first behaviour
        expect(sub).toBe(null);
      }

      if (sub && sub.type && sub.data) {
        // second behaviour
        expect(val).toHaveProperty('type');
        expect(val).toHaveProperty('data');
        expect(val).toStrictEqual(nxtEvent);
        done(null);
      }
    });
    instance.outEvent.next(nxtEvent);
  }));
});
