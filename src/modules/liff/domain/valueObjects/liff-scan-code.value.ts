export class LiffScanCode {
  constructor(private readonly value: string) {}

  public getValue(): string {
    return this.value;
  }

  public isUrl(): boolean {
    try {
      new URL(this.value);
      return true;
    } catch {
      return false;
    }
  }
}
