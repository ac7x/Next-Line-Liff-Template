export class LiffUniversalLink {
  constructor(
    private readonly url: string
  ) {
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid Universal Link URL format');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public get value(): string {
    return this.url;
  }
}
