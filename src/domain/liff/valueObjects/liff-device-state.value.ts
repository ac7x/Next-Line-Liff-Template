export class LiffDeviceState {
  constructor(
    private readonly state: {
      isVideoAutoPlay?: boolean;
      hasAudioPlayer?: boolean;
      hasWebP?: boolean;
      hasPictureInPicture?: boolean;
      hasBackgroundColorScheme?: boolean;
    }
  ) {}

  public get value() {
    return this.state;
  }

  public canPlayVideo(): boolean {
    return this.state.isVideoAutoPlay || false;
  }

  public canPlayAudio(): boolean {
    return this.state.hasAudioPlayer || false;
  }

  public supportsWebP(): boolean {
    return this.state.hasWebP || false;
  }
}
