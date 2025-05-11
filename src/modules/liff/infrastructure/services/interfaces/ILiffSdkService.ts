import { LiffInitOptions, LiffProfile } from '@/modules/liff/interfaces/client';

export interface ILiffSdkService {
  initialize(options: LiffInitOptions): Promise<void>;
  isInitialized(): boolean;
  getProfile(): Promise<LiffProfile>;
  getFriendship(): Promise<{ friendFlag: boolean }>;
  login(): Promise<void>;
  logout(): void;
  isLoggedIn(): boolean;
  isInClient(): boolean;
  getOS(): string | undefined;
  getLanguage(): string;
  getVersion(): string;
  getLineVersion(): string | null;
  openWindow(url: string, external: boolean): void;
  closeWindow(): void;
  scanCode(): Promise<string | null>;
}
