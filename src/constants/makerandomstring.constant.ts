import { Tmkrandomstringhow } from '../types/union.types';

export const makeRandomString = (
  length: number,
  how: Tmkrandomstringhow
): string => {
  let outString = '';
  let inOptions;
  switch (how) {
    case 'numbers':
      inOptions = '0123456789';
      break;
    case 'letters':
      inOptions = 'abcdefghijklmnopqrstuvwxyz';
      break;
    case 'combined':
      inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
      break;
  }
  for (let i = 0; i < length; i++) {
    outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
  }
  return outString;
};
