import { expect, describe, it } from 'vitest';
import { makeRandomString } from '../../../src/constants/makerandomstring.constant';

describe('makeRandomString', () => {
  it('makeRandomString should return array of 11 number strings ', () => {
    const numStr = makeRandomString(11, 'numbers');
    expect(typeof numStr).toBe('string');
    expect(numStr.length).toBe(11);
    expect(typeof parseInt(numStr.charAt(0), 10)).toBe('number');
  });

  it('makeRandomString should return array of 11 letter strings ', () => {
    const strStr = makeRandomString(11, 'letters');
    expect(typeof strStr).toBe('string');
    expect(strStr.length).toBe(11);
    expect(typeof strStr.charAt(0)).toBe('string');
  });

  it('makeRandomString should return array of 11 characters mixed with numbers and strings ', () => {
    const strMixed = makeRandomString(11, 'combined');
    expect(typeof strMixed).toBe('string');
    expect(strMixed.length).toBe(11);
    expect(typeof strMixed.charAt(0)).toBe('string');
  });
});
