import { object, number, string, date, boolean } from 'yup';


export const appCreation = object({
  name: string().required(),
  passwordLenght: number().required(),
  uppercaseLetters: boolean().required(),
  symbols: boolean().required(),
  numbers: boolean().required(),
  refreshToken: boolean().required(),
  canCheckWithApiKeyOnly: boolean().required(),
  tokenHoursValidity: number().required(),
  refreshTokenHoursValidity: number().required(),
  resetTokenHoursValidity: number().required(),
}).required();

export const appUpdate = object({
  name: string().required(),
  tokenHoursValidity: number().required(),
  refreshTokenHoursValidity: number().required(),
  resetTokenHoursValidity: number().required(),
}).required();
