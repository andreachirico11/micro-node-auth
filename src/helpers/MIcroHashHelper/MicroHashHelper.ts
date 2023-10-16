import fetch, { RequestInit } from 'node-fetch';
import { HashResponse, HashErrorResponse, HashBody } from './models';

export class MicroHashHelper {
  constructor(private baseUrl: string, private timeoutOnPing = false) {}

  async hashString(input: string): Promise<HashResponse | HashErrorResponse> {
    const url = this.baseUrl + '/hash';
    const hashBody: HashBody = { input };
    const r = await fetch(url, this.getPostOptions(hashBody));
    return r.json();
  }

  async ping() {
    const {ok} = await fetch(this.baseUrl + "/ping");
    if (this.timeoutOnPing) {
      await new Promise((r) => setTimeout(() => r(null), 30000))
    }
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