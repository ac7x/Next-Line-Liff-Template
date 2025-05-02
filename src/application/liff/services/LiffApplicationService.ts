import { User } from '@/domain/liff/entities/User';
import { IUserRepository } from '@/domain/liff/repositories/IUserRepository';
import { LiffProfile } from '@/domain/liff/valueObjects/LiffProfile';
import { ILiffSdkService } from '@/infrastructure/liff/services/interfaces/ILiffSdkService';
import { LiffInitOptions } from '@/interfaces/liff/client';

export class LiffApplicationService {
  constructor(
    private readonly liffSdkService: ILiffSdkService,
    private readonly userRepository: IUserRepository
  ) {}

  async initializeLiff(options: LiffInitOptions): Promise<void> {
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

  getOS(): string {
    return this.liffSdkService.getOS() || '';
  }

  getLanguage(): string {
    return this.liffSdkService.getLanguage();
  }

  getVersion(): string {
    return this.liffSdkService.getVersion();
  }

  getLineVersion(): string {
    return this.liffSdkService.getLineVersion() || '';
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

  async saveUserProfile(): Promise<User | null> {
    if (!this.liffSdkService.isInitialized() || !this.liffSdkService.isLoggedIn()) {
      return null;
    }

    try {
      const profile = await this.getProfile();
      const friendship = await this.getFriendship();

      // 領域邏輯: 檢查是否為有效用戶
      if (!profile.userId) {
        throw new Error('Invalid user profile: missing userId');
      }

      const existingUser = await this.userRepository.findByUserId(profile.userId);

      if (existingUser) {
        // 使用實體方法更新資料，保持領域邏輯的一致性
        existingUser.updateProfile(profile);
        existingUser.updateFriendship(friendship.friendFlag);
        return await this.userRepository.save(existingUser);
      } else {
        // 創建新的領域實體
        const user = new User(profile.userId, profile, friendship.friendFlag);
        return await this.userRepository.save(user);
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
      return null;
    }
  }

  async verifyBotConnection(): Promise<boolean> {
    try {
      // 透過相關 API 檢查 Bot 和 LIFF 是否正確連結
      // 這部分可能需要使用 LINE Login API 進行驗證
      return true;
    } catch (error) {
      console.error('檢查 Bot 連結失敗:', error);
      return false;
    }
  }
}
