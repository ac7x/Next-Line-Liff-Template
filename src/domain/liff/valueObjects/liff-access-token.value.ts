export class LiffAccessToken {
  constructor(private readonly token: string) {
    if (!token) throw new Error('Access token cannot be empty');
  }

  public get value(): string {
    return this.token;
  }

  public getMasked(): string {
    return this.token.substring(0, 6) + '...' + this.token.slice(-4);
  }
}
