export class LiffIdToken {
  constructor(
    private readonly token: string,
    private readonly decodedPayload?: {
      iss: string;
      sub: string;
      aud: string;
      exp: number;
      iat: number;
      nonce: string;
      amr: string[];
      name: string;
      picture: string;
      email: string;
    }
  ) {}

  public get value(): string {
    return this.token;
  }

  public get payload() {
    return this.decodedPayload;
  }

  public isExpired(): boolean {
    if (!this.decodedPayload?.exp) return true;
    return Date.now() >= this.decodedPayload.exp * 1000;
  }
}
