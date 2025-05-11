import { ILiffService } from '@/modules/liff/domain/liff.service';
import { LiffExternalWindow } from '@/modules/liff/domain/valueObjects/liff-external-window.value';
import { LiffFriendship } from '@/modules/liff/domain/valueObjects/liff-friendship.value';
import { LiffInitConfig } from '@/modules/liff/domain/valueObjects/liff-init-config.value';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/liff-profile.value';
import { getLiffConfig } from '@/modules/liff/infrastructure/config/liff.config';

export class LiffApplication {
  constructor(private readonly liffService: ILiffService) {}

  async initializeLiff(): Promise<void> {
    const { liffId } = getLiffConfig(); // 確保環境變數已正確配置
    const config = new LiffInitConfig(liffId);
    await this.liffService.initialize(config);
  }

  async getUserProfile(): Promise<LiffProfile> {
    // Check login status before getting profile
    if (!(await this.liffService.isLoggedIn())) {
      // Trigger login if not logged in
      await this.liffService.login();
      // It might be necessary to wait or reload after login
      // For simplicity, assume login completes and profile is available
    }
    // Add error handling if profile fetch fails
    return await this.liffService.getProfile();
  }

  async handleLogin(): Promise<void> {
    await this.liffService.login();
  }

  async handleLogout(): Promise<void> {
    await this.liffService.logout();
  }

  async checkLoginStatus(): Promise<boolean> {
    return await this.liffService.isLoggedIn();
  }

  async isInClientApp(): Promise<boolean> {
    return await this.liffService.isInClient();
  }

  // Added method
  async checkFriendship(): Promise<LiffFriendship> {
    return await this.liffService.getFriendship();
  }

  // Added method
  openExternalWindow(url: string, external: boolean = true): void {
    const config = new LiffExternalWindow(url, external);
    this.liffService.openWindow(config);
  }
}
