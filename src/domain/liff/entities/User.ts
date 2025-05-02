import { LiffProfile } from '../valueObjects/LiffProfile';

export class User {
  private readonly _userId: string;
  private _profile: LiffProfile;
  private _isFriend: boolean;

  constructor(userId: string, profile: LiffProfile, isFriend: boolean = false) {
    this._userId = userId;
    this._profile = profile;
    this._isFriend = isFriend;
  }

  get userId(): string {
    return this._userId;
  }

  get profile(): LiffProfile {
    return this._profile;
  }

  get isFriend(): boolean {
    return this._isFriend;
  }

  updateProfile(profile: LiffProfile): void {
    this._profile = profile;
  }

  updateFriendship(isFriend: boolean): void {
    this._isFriend = isFriend;
  }
}
