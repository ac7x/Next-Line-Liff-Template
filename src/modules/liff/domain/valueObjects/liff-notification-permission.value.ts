export type NotificationPermissionState = 'granted' | 'denied' | 'default';

export class LiffNotificationPermission {
  constructor(
    private readonly state: NotificationPermissionState
  ) {}

  public get value(): NotificationPermissionState {
    return this.state;
  }

  public isGranted(): boolean {
    return this.state === 'granted';
  }

  public isDenied(): boolean {
    return this.state === 'denied';
  }

  public isPending(): boolean {
    return this.state === 'default';
  }
}
