export class LiffApiAvailability {
  constructor(
    private readonly apiName: string,
    private readonly available: boolean
  ) {}

  public get value(): boolean {
    return this.available;
  }

  public getApiName(): string {
    return this.apiName;
  }
}
