// Define supported languages based on documentation or keep as string
const SUPPORTED_LANGS: string[] = ['en', 'ja', 'th', 'zh-Hant', 'zh-Hans', 'id', 'ko', 'vi', 'es', 'fr', 'de', 'pt-BR']; // Example list

export class LiffI18n {
  private langValue: string; // Changed type to string

  constructor(lang: string) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn(`Unsupported language tag: ${lang}. Defaulting to 'en'.`);
      this.langValue = 'en'; // Default or throw error
    } else {
      this.langValue = lang;
    }
  }

  public get value(): string { // Changed return type to string
    return this.langValue;
  }
}
