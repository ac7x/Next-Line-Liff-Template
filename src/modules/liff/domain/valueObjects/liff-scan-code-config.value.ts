export class LiffScanCodeConfig {
  constructor(
    private readonly config: {
      readonly aggressive?: boolean;
    } = {}
  ) {}

  public get value() {
    return this.config;
  }
}
