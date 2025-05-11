// Use permission names expected by liff.permission.query
export type LiffFeaturePermission = 'multipleTabs' | 'scanCode' | 'shareTargetPicker';

export class LiffPermission {
  constructor(
    private readonly featureName: LiffFeaturePermission
  ) {}

  public get value(): LiffFeaturePermission {
    return this.featureName;
  }
}
