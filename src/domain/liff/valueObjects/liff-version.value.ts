export class LiffVersion {
  constructor(private readonly version: string) {}

  public get value(): string {
    return this.version;
  }

  public isGreaterThan(otherVersion: string): boolean {
    return this.compareVersions(this.version, otherVersion) > 0;
  }

  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      if (part1 !== part2) return part1 - part2;
    }
    return 0;
  }
}
