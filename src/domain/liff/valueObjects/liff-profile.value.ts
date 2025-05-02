export class LiffProfile {
  constructor(
    private readonly userId: string,
    private readonly displayName: string,
    private readonly pictureUrl?: string,
    private readonly statusMessage?: string
  ) {}

  public get value() {
    return {
      userId: this.userId,
      displayName: this.displayName,
      pictureUrl: this.pictureUrl,
      statusMessage: this.statusMessage
    };
  }
}
