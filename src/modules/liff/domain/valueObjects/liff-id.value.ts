export class LiffId {
  constructor(
    private readonly id: string
  ) {
    if (!id) {
      throw new Error('LIFF ID cannot be empty');
    }
    if (!this.isValidLiffId(id)) {
      throw new Error('Invalid LIFF ID format');
    }
  }

  private isValidLiffId(id: string): boolean {
    return /^\d{13}-[a-zA-Z0-9]{32}$/.test(id);
  }

  public get value(): string {
    return this.id;
  }
}
