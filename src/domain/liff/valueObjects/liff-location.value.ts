export class LiffLocation {
  constructor(
    private readonly coordinates: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    }
  ) {
    this.validateCoordinates();
  }

  private validateCoordinates(): void {
    if (this.coordinates.latitude < -90 || this.coordinates.latitude > 90) {
      throw new Error('Invalid latitude value');
    }
    if (this.coordinates.longitude < -180 || this.coordinates.longitude > 180) {
      throw new Error('Invalid longitude value');
    }
  }

  public get value() {
    return this.coordinates;
  }
}
