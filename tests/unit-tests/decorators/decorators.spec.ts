import { expect, describe, it } from 'vitest';
import { autoUnsub } from '../../../src/decorators/class.decorators';

describe('Decorators', () => {
  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(AuthController);
  });

  it('should confirm user', async() => {
    expect(await instance.confirm(userInfo as any, '/')).toStrictEqual(mockValue);
  });

  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});
