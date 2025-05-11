import type { LiffProfile as LiffProfileType } from '@/modules/liff/interfaces/client';

export class LiffProfile {
  private readonly _userId: string;
  private readonly _displayName: string;
  private readonly _pictureUrl?: string;
  private readonly _statusMessage?: string;

  constructor(userId: string, displayName: string, pictureUrl?: string, statusMessage?: string) {
    // 增加領域驗證邏輯
    if (!userId && displayName) {
      throw new Error('UserId is required when displayName is provided');
    }

    this._userId = userId;
    this._displayName = displayName;
    this._pictureUrl = pictureUrl;
    this._statusMessage = statusMessage;
  }

  static createDefault(): LiffProfile {
    return new LiffProfile('', '');
  }

  static fromLiffProfile(profile: LiffProfileType): LiffProfile {
    return new LiffProfile(
      profile.userId,
      profile.displayName,
      profile.pictureUrl,
      profile.statusMessage
    );
  }

  get userId(): string {
    return this._userId;
  }
  get displayName(): string {
    return this._displayName;
  }
  get pictureUrl(): string | undefined {
    return this._pictureUrl;
  }
  get statusMessage(): string | undefined {
    return this._statusMessage;
  }

  equals(other: LiffProfile): boolean {
    return (
      this._userId === other._userId &&
      this._displayName === other._displayName &&
      this._pictureUrl === other._pictureUrl &&
      this._statusMessage === other._statusMessage
    );
  }

  toJSON(): LiffProfileType {
    return {
      userId: this._userId,
      displayName: this._displayName,
      pictureUrl: this._pictureUrl,
      statusMessage: this._statusMessage,
    };
  }
}
