import {ParsedVariables} from "dotenv-parse-variables";

export default interface IEnvs extends ParsedVariables {
    PRODUCTION: boolean;
    DB_URI: string;
    PORT: number;
    BASE_URL: string;
  }
  