import { object, number, string } from 'yup';

export const userCreation = object({
  name: string().required(),
  password: string().required(),
}).required();

export const userAuth = object({
  username: string().required(),
  password: string().required()
}).required();
