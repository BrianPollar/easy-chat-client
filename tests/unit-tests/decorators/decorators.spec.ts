import { expect, describe, it } from 'vitest';
import { autoUnsub } from '../../../src/decorators/class.decorators';

describe('Decorators', () => {
  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(AuthController);
  });
});
