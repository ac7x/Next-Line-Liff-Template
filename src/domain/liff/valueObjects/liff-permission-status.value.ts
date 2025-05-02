export type PermissionStatus = 'granted' | 'denied' | 'prompt';

export class LiffPermissionStatus {
  constructor(private readonly status: PermissionStatus) {}

  public get value(): PermissionStatus {
    return this.status;
  }

  public isGranted(): boolean {
    return this.status === 'granted';
  }

  public isDenied(): boolean {
    return this.status === 'denied';
  }
}
