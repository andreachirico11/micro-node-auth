import { object, number, string, date } from 'yup';

export const userCreation = object({
  name: string().required(),
  password: string().required(),
  app_id: number(),
}).required();

export const userAuth = object({
  username: string().required(),
  password: string().required(),
}).required();
