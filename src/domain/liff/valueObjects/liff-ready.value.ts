export class LiffReady {
  constructor(
    private readonly isReady: boolean
  ) {}

  public get value(): boolean {
    return this.isReady;
  }
}
