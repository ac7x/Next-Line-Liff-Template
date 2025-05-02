export class LiffPermanentLink {
  constructor(
    private readonly url: string // Changed to accept URL string
  ) {
     if (!this.isValidUrl(url)) {
       throw new Error('Invalid Permanent Link URL format');
     }
  }

   private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      // Add more specific checks if needed, e.g., must be liff.line.me domain
      return url.startsWith('https://liff.line.me/');
    } catch {
      return false;
    }
  }

  public get value(): string { // Changed return type
    return this.url;
  }

  // Remove toString if not needed, or update it
  // public toString(): string {
  //   return this.url;
  // }
}
