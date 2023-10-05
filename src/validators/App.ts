import { object, number, string, date, array } from 'yup';

// TODO date validation

export const appValidator = object({
  _id: number().optional(),
  name: string().required(),
  dateAdd: date().required(),
  users: array().optional().of(number()),
}).required();
