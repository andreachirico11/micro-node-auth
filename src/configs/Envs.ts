import { config } from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import IEnvs from '../types/IEnvs';
import { log_info } from '../utils/log';

const defaultEnvs: IEnvs = {
  PORT: 1234,
  PRODUCTION: false,
  BASE_URL: '',
  DB_URI: '',
  SYMBOLS_REGEX: '[!@#$%&*(\\)_+=|<>?\\[\\]{}]',
  MICRO_HASH_URI: ''
};

let { error, parsed: preParsingVars } = config({});
if (error) {
  log_info(error, '.env file not found, using process envs');
  preParsingVars = process.env;
}
const parsedEnvs = dotenvParseVariables(preParsingVars) as IEnvs;

export const {
  PORT = defaultEnvs.PORT,
  PRODUCTION = defaultEnvs.PRODUCTION,
  BASE_URL = defaultEnvs.BASE_URL,
  DB_URI = defaultEnvs.DB_URI,
  SYMBOLS_REGEX = defaultEnvs.SYMBOLS_REGEX,
  MICRO_HASH_URI = defaultEnvs.MICRO_HASH_URI
} = parsedEnvs;

log_info(
  {
    PORT,
    PRODUCTION,
    BASE_URL,
    DB_URI,
    SYMBOLS_REGEX,
    MICRO_HASH_URI
  },
  '--------- Actual Environments -------'
);
