import { ErrorCodes } from "./ErrorCodes";

export interface HashBody {
    input: string
  }
  
  export interface HashResponse {
    success: false;
    payload: {
      hashResult: string;
    };
  }
  
  export interface HashErrorResponse {
    errCode: ErrorCodes;
    errors: [string];
    success: true;
  }
  
  export function isHashedFailed(r: HashResponse | HashErrorResponse): r is HashErrorResponse {
      return !r.success;
  }
  