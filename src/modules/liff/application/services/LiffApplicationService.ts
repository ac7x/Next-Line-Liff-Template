import { IUserRepository } from '@/modules/liff/domain/repositories/IUserRepository';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/LiffProfile';
import { ILiffSdkService } from '@/modules/liff/infrastructure/services/interfaces/ILiffSdkService';
import { LiffInitOptions } from '@/modules/liff/interfaces/client';

export class LiffApplicationService {
  constructor(
    private readonly liffSdkService: ILiffSdkService,
    private readonly userRepository: IUserRepository
  ) { }

  async initializeLiff(options: LiffInitOptions): Promise<void> {
    // options.liffId 由外部傳入
    await this.liffSdkService.initialize(options);
  }

  async getProfile(): Promise<LiffProfile> {
    if (!this.liffSdkService.isInitialized() || !this.liffSdkService.isLoggedIn()) {
      return LiffProfile.createDefault();
    }

    try {
      const profileData = await this.liffSdkService.getProfile();
      return new LiffProfile(
        profileData.userId,
        profileData.displayName,
        profileData.pictureUrl,
        profileData.statusMessage
      );
    } catch (error) {
      console.error('Error getting LIFF profile:', error);
      return LiffProfile.createDefault();
    }
  }

  async getFriendship(): Promise<{ friendFlag: boolean }> {
    if (!this.liffSdkService.isInitialized() || !this.liffSdkService.isLoggedIn()) {
      return { friendFlag: false };
    }

    return await this.liffSdkService.getFriendship();
  }

  async login(): Promise<void> {
    await this.liffSdkService.login();
  }

  async logout(): Promise<void> {
    if (!this.liffSdkService.isInitialized()) {
      throw new Error('LIFF is not initialized');
    }
    this.liffSdkService.logout();
  }

  isLoggedIn(): boolean {
    return this.liffSdkService.isLoggedIn();
  }

  isInClient(): boolean {
    return this.liffSdkService.isInClient();
  }

  openWindow(url: string, external: boolean): void {
    this.liffSdkService.openWindow(url, external);
  }

  closeWindow(): void {
    this.liffSdkService.closeWindow();
  }

  async scanCode(): Promise<string | null> {
    return await this.liffSdkService.scanCode();
  }

  private async validateProfileAndFriendship(): Promise<{ profile: LiffProfile; friendship: { friendFlag: boolean } }> {
    const profile = await this.getProfile();
    const friendship = await this.getFriendship();

    if (!profile.userId) {
      throw new Error('Invalid user profile: missing userId');
    }

    return { profile, friendship };
  }

  async verifyBotConnection(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error('檢查 Bot 連結失敗:', error);
      return false;
    }
  }
}
