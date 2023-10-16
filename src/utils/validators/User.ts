import { object, number, string, date } from 'yup';

export const userValidator = object({
  _id: number().optional(),
  name: string().required(),
  dateAdd: date().required(),
  password: string().required(),
  datePasswordChange: date().optional(),
  authToken: string().optional(),
  dateTokenExp: date().optional(),
  app_id: number().optional(),
  refreshToken: string().optional(),
  dateRefTokenExp: date().optional(),
  resetToken: string().optional(),
  dateResetTokenExp: date().optional(),
}).required();

export const userAuth = object({
  username: string().required(),
  password: string().required(),
}).required();
