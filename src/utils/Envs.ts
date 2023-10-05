import {config} from 'dotenv';
import * as dotenvParseVariables from "dotenv-parse-variables";
import IEnvs from '../types/IEnvs';
import { log_info } from './log';


let parsedEnvs: IEnvs;
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  const {error, parsed} = config({});
  if (!error) {
    parsedEnvs = dotenvParseVariables(parsed) as IEnvs;
    log_info(parsedEnvs, "--------- Actual Environments -------");
  }
}

export const {DB_URI, PRODUCTION, PORT, BASE_URL} = parsedEnvs || process.env;



