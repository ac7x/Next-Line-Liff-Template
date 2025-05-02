export class LiffBluetoothPermission {
  constructor(private readonly permission: boolean) {}

  public get value(): boolean {
    return this.permission;
  }
}
