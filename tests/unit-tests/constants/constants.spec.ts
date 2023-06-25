import { expect, describe, it } from 'vitest';
import { makeRandomString } from '../../../src/constants/makerandomstring.constant';

describe('constants', () => {
  it('makeRandomString should return array of 11 number strings ', () => {
    const arrNums = makeRandomString(11, 'numbers');
    expect(arrNums).toBe(typeof 'string');
    expect(arrNums.length).toBe(11);
    expect(parseInt(arrNums.charAt(0), 10)).toBe(typeof 'number');
  });

  it('makeRandomString should return array of 11 letter strings ', () => {
    const arrNums = makeRandomString(11, 'letters');
    expect(arrNums).toBe(typeof 'string');
    expect(arrNums.length).toBe(11);
    expect(arrNums.charAt(0)).toBe(typeof 'string');
  });

  it('makeRandomString should return array of 11 characters mixed with numbers and strings ', () => {
    const arrNums = makeRandomString(11, 'combined');
    expect(arrNums).toBe(typeof 'string');
    expect(arrNums.length).toBe(11);
    expect(arrNums.charAt(0)).toBe(typeof 'string');
  });
});
