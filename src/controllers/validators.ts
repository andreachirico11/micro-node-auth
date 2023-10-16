import { RequestHandler } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { log_error, log_info } from '../utils/log';
import { ValidationErrResp } from '../types/ApiResponses';
import { AddUserReq } from '../models/RequestTypes';
import { GetSetAppInRequest } from '../utils/GetSetAppInRequest';
import generatePasswordSchema from '../utils/validators/Password';
import { SYMBOLS_REGEX } from '../configs/Envs';

export const getRequestBodyValidator = (schema: ObjectSchema<any>) => {
  return function ({ body }, res, next) {
    try {
      schema.validateSync(body);
      log_info('Request body is valid');
      next();
    } catch (e) {
      let message = 'Unknown Validation Error';
      if (e instanceof ValidationError) {
        message = e.message;
        log_error(message);
      }
      new ValidationErrResp(res, [message]);
    }
  } as RequestHandler;
};

export const checkAppPasswordRequirements: RequestHandler = async (req: AddUserReq, res, next) => {
  try {
    const {
      body: { password },
    } = req;
    const foundApp = GetSetAppInRequest.getApp(req);
    const { _id, numbers, passwordLenght, symbols, uppercaseLetters, symbolsRegex } = foundApp;

    log_info(
      { passwordLenght, numbers, symbols, uppercaseLetters },
      `App with id: ${_id} requirements are:`
    );

    generatePasswordSchema(
      passwordLenght,
      numbers,
      symbols,
      uppercaseLetters,
      SYMBOLS_REGEX
    ).validateSync(password);
    log_info('Password is valid');
    
    next();
  } catch (e) {
    const message =
      e instanceof SyntaxError
        ? 'Invalid Symbol Regular expression'
        : e instanceof ValidationError
        ? e.message
        : 'Unknown Validation Error';
    log_error(message);
    new ValidationErrResp(res, [message]);
  }
};
