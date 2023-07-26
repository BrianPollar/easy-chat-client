import { makeRandomString } from '../../src/constants/makerandomstring.constant';

export const tickTimer = (duration = 5000) => new Promise(resolve => {
  const tickId = makeRandomString(33, 'combined');
  setTimeout(() => resolve(tickId), duration);
});

export const tickIntervaler = (duration = 5000) => new Promise(resolve => {
  const tickId = makeRandomString(33, 'combined');
  setInterval(()=> resolve(tickId), duration);
});

