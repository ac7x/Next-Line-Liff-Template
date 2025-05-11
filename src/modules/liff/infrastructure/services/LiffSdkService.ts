import LiffClientBase, { LiffInitOptions } from '@/modules/liff/interfaces/client';
import type { ILiffSdkService } from './interfaces/ILiffSdkService';

export class LiffSdkService implements ILiffSdkService {
  private _isInitialized = false;

  async initialize(options: LiffInitOptions): Promise<void> {
    // options.liffId 應由外部傳入，確保動態
    await LiffClientBase.init(options);
    this._isInitialized = true;
  }

  isInitialized(): boolean {
    return this._isInitialized;
  }

  getProfile = LiffClientBase.getProfile;
  getFriendship = LiffClientBase.getFriendship;
  login = LiffClientBase.login;
  logout = LiffClientBase.logout;
  isLoggedIn = LiffClientBase.isLoggedIn;
  isInClient = LiffClientBase.isInClient;
  getOS = LiffClientBase.getOS;
  getLanguage = LiffClientBase.getLanguage;
  getVersion = LiffClientBase.getVersion;
  getLineVersion = LiffClientBase.getLineVersion;

  openWindow(url: string, external: boolean): void {
    LiffClientBase.openWindow({ url, external });
  }

  closeWindow = LiffClientBase.closeWindow;
  scanCode = LiffClientBase.scanCode;
}

// 單例模式，確保整個應用只有一個 LiffSdkService 實例
export const liffSdkService = new LiffSdkService();
