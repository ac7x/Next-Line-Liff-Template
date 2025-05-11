export class LiffLanguage {
  constructor(private readonly language: string) {}

  public get value(): string {
    return this.language;
  }

  public getLanguageCode(): string {
    return this.language.split('-')[0];
  }

  public getRegion(): string | null {
    const parts = this.language.split('-');
    return parts.length > 1 ? parts[1] : null;
  }
}
