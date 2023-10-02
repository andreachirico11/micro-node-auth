import {config} from 'dotenv';
import * as dotenvParseVariables from "dotenv-parse-variables";
import IEnvs from '../types/IEnvs';


let parsedEnvs: IEnvs;
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  const {error, parsed} = config({});
  if (!error) {
    parsedEnvs = dotenvParseVariables(parsed) as IEnvs;
    console.log("Got variables from .env file");
  }
}

export const {DB_URI, PRODUCTION, PORT, BASE_URL} = parsedEnvs || process.env;



