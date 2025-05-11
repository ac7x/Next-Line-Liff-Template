export class LiffInitConfig {
  constructor(
    private readonly liffId: string,
    private readonly withLoginOnExternalBrowser?: boolean
  ) {}

  public get value() {
    return {
      liffId: this.liffId,
      withLoginOnExternalBrowser: this.withLoginOnExternalBrowser
    };
  }
}
