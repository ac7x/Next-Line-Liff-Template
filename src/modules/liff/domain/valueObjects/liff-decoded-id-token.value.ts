export class LiffDecodedIdToken {
  constructor(
    private readonly payload: {
      iss?: string; // Made optional
      sub?: string; // Made optional
      aud?: string; // Made optional
      exp: number;
      iat: number;
      auth_time?: number; // Made optional
      nonce?: string; // Made optional
      amr?: string[]; // Made optional
      name?: string; // Made optional
      picture?: string; // Made optional
      email?: string;
    }
  ) {
    // Add validation if needed, e.g., check for required fields like exp, iat
    if (typeof payload.exp !== 'number' || typeof payload.iat !== 'number') {
      throw new Error('Decoded ID Token must contain exp and iat');
    }
  }

  public get value() {
    return this.payload;
  }

  public isExpired(): boolean {
    return Date.now() >= this.payload.exp * 1000;
  }

  public getEmail(): string | undefined {
    return this.payload.email;
  }

  public getName(): string | undefined { // Changed return type
    return this.payload.name;
  }

  public getUserId(): string | undefined { // Added getter for sub
      return this.payload.sub;
  }
}
