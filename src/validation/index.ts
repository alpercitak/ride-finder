/**
 * Converts the given value to boolean
 * @param value Value to be checked
 * @returns boolean
 */
export const checkBoolean = (value: any): boolean =>
  !(value === 'false' || value === '0' || value === '' || value === undefined);

/**
 * Checks if the number is a positive integer or zero
 * @param value Value to be checked
 * @returns boolean
 */
export const isValidNumber = (value: number): boolean => !isNaN(value) && value >= 0;
