// 需要新增:
// filepath: src/domain/liff/valueObjects/liff-app-language.value.ts
export class LiffAppLanguage {
    constructor(private readonly language: string) {}
    
    public get value(): string {
      return this.language;
    }
  }