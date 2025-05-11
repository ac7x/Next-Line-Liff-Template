import { LiffProfile } from '../valueObjects/liff-profile';

export class LiffProfileUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly oldProfile: LiffProfile | null,
    public readonly newProfile: LiffProfile,
    public readonly timestamp: Date = new Date()
  ) {}

  static createNew(userId: string, oldProfile: LiffProfile | null, newProfile: LiffProfile): LiffProfileUpdatedEvent {
    return new LiffProfileUpdatedEvent(userId, oldProfile, newProfile);
  }
}
