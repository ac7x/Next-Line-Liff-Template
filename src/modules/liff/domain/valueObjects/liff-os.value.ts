export class LiffOs {
  constructor(
    private readonly os: 'ios' | 'android' | 'web'
  ) {}

  public get value() {
    return this.os;
  }

  public isIos(): boolean {
    return this.os === 'ios';
  }

  public isAndroid(): boolean {
    return this.os === 'android';
  }

  public isWeb(): boolean {
    return this.os === 'web';
  }
}
