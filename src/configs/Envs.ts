import { config } from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import IEnvs from '../types/IEnvs';
import { log_info } from '../utils/log';

const aes56ctr = 'aes-256-ctr';
export const CRYPT_ALGORITHMS = {aes56ctr};


export declare const DEFAULT_REGEX = '[!@#$%&*(\\)_+=|<>?\\[\\]{}]';
export declare const DEFAULT_CRYPT_ALGORITHM = 'aes-256-ctr';

let parsedEnvs: IEnvs;
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  const { error, parsed } = config({});
  if (!error) {
    parsedEnvs = dotenvParseVariables(parsed) as IEnvs;
    log_info(parsedEnvs, '--------- Actual Environments -------');
  }
}

export const { DB_URI, PRODUCTION, PORT, BASE_URL } = parsedEnvs || process.env;
