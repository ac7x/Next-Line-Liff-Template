export class LiffExternalWindow {
  constructor(
    private readonly url: string,
    private readonly external?: boolean,
  ) {
    if (!url) {
      throw new Error('URL cannot be empty');
    }
  }

  public get value() {
    return {
      url: this.url,
      external: this.external
    };
  }
}
