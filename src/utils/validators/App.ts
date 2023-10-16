import { object, number, string, date, boolean } from 'yup';

// TODO date validation

export const appValidator = object({
  _id: number().optional(),
  name: string().required(),
  dateAdd: date().required(),
  passwordLenght: number().required(),
  uppercaseLetters: boolean().required(),
  symbols: boolean().required(),
  numbers: boolean().required(),
  tokenHoursValidity: number().required(),
}).required();
