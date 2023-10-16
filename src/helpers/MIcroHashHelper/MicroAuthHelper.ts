import fetch, { RequestInit } from 'node-fetch';
import { HashResponse, HashErrorResponse, HashBody } from './models';

export class MicroHashHelper {
  constructor(private baseUrl: string) {}

  async hashString(input: string): Promise<HashResponse | HashErrorResponse> {
    const url = this.baseUrl + '/hash';
    const hashBody: HashBody = { input };
    const r = await fetch(url, this.getPostOptions(hashBody));
    return r.json();
  }

  async ping() {
    const {ok} = await fetch(this.baseUrl + "/ping");
    return ok;
  }

  private getPostOptions(body: HashBody): RequestInit {
    return {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}