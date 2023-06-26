// This file imports the `Tmkrandomstringhow` type from the `union.types` file.
import { Tmkrandomstringhow } from '../types/union.types';

// This function generates a random string of the specified length and type.
export const makeRandomString = (
  // The length of the random string to generate.
  length: number,
  // The type of the random string to generate.
  how: Tmkrandomstringhow
): string => {
  // The output string.
  let outString = '';
  // The input options for the random string.
  let inOptions;

  // Switch on the `how` parameter to determine the input options.
  switch (how) {
    case 'numbers':
      // The input options are the numbers 0-9.
      inOptions = '0123456789';
      break;
    case 'letters':
      // The input options are the letters a-z.
      inOptions = 'abcdefghijklmnopqrstuvwxyz';
      break;
    case 'combined':
      // The input options are the letters a-z and the numbers 0-9.
      inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
      break;
  }

  // For each character in the random string:
  for (let i = 0; i < length; i++) {
    // Add a character from the input options to the output string.
    outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
  }

  // Return the output string.
  return outString;
};
