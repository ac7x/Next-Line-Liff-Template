import { LiffAccessToken } from './valueObjects/liff-access-token.value';
import { LiffApiAvailability } from './valueObjects/liff-api-availability.value';
import { LiffAppLanguage } from './valueObjects/liff-app-language.value';
// LiffBluetoothPermission removed
import { LiffContext } from './valueObjects/liff-context.value';
import { LiffDecodedIdToken } from './valueObjects/liff-decoded-id-token.value';
import { LiffDeviceState } from './valueObjects/liff-device-state.value';
import { LiffExternalWindow } from './valueObjects/liff-external-window.value';
import { LiffFriendship } from './valueObjects/liff-friendship.value'; // Added
import { LiffI18n } from './valueObjects/liff-i18n.value';
import { LiffIdToken } from './valueObjects/liff-id-token.value';
import { LiffId } from './valueObjects/liff-id.value';
import { LiffInitConfig } from './valueObjects/liff-init-config.value';
import { LiffLanguage } from './valueObjects/liff-language.value';
import { LiffLineVersion } from './valueObjects/liff-line-version.value';
import { LiffLocation } from './valueObjects/liff-location.value';
import { LiffMessage } from './valueObjects/liff-message.value';
// LiffNotificationPermission removed
import { LiffOs } from './valueObjects/liff-os.value';
import { LiffPermanentLink } from './valueObjects/liff-permanent-link.value';
import { LiffPermissionStatus } from './valueObjects/liff-permission-status.value'; // Added
import { LiffPermission } from './valueObjects/liff-permission.value';
import { LiffProfile } from './valueObjects/liff-profile.value';
// LiffReady removed
// LiffScanCodeConfig removed
import { LiffScanCode } from './valueObjects/liff-scan-code.value';
import { LiffShareTargetPicker } from './valueObjects/liff-share-target-picker.value';
import { LiffUniversalLink } from './valueObjects/liff-universal-link.value';
import { LiffUse } from './valueObjects/liff-use.value';
import { LiffVersion } from './valueObjects/liff-version.value';

export interface ILiffService {
  initialize(config: LiffInitConfig): Promise<void>;
  getProfile(): Promise<LiffProfile>;
  login(): Promise<void>;
  logout(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  isInClient(): Promise<boolean>;

  // Existing methods
  openShareTargetPicker(shareConfig: LiffShareTargetPicker): Promise<void>;
  scanCode(): Promise<LiffScanCode | null>;
  openWindow(windowConfig: LiffExternalWindow): void;
  permission(permission: LiffPermission): Promise<LiffPermissionStatus>;
  closeWindow(): void;
  getFriendship(): Promise<LiffFriendship>;
  getVersion(): Promise<LiffVersion>;
  getOs(): Promise<LiffOs>;
  getLanguage(): Promise<LiffLanguage>;
  getIDToken(): Promise<LiffIdToken | null>;
  getContext(): Promise<LiffContext | null>;
  getLocation(): Promise<LiffLocation>;
  getDeviceState(): Promise<LiffDeviceState>;
  openUniversalLink(link: LiffUniversalLink): Promise<void>;
  isApiAvailable(apiName: string): Promise<LiffApiAvailability>;
  getAccessToken(): Promise<LiffAccessToken | null>;
  getLineVersion(): Promise<LiffLineVersion | null>;
  createPermanentLink(params: Record<string, string>): Promise<LiffPermanentLink | null>;
  setLanguage(lang: LiffI18n): Promise<void>;
  sendMessages(messages: LiffMessage): Promise<void>;
  requestAllPermissions(): Promise<void>;
  getId(): Promise<LiffId | null>;
  getAppLanguage(): Promise<LiffAppLanguage>;
  getDecodedIDToken(): Promise<LiffDecodedIdToken | null>;
  usePlugin(plugin: LiffUse): Promise<void>;
}

// Mock implementation needs update for removed methods
export class LiffService implements ILiffService {
  // ... existing mock methods ...

  // Remove mock methods for:
  // - requestBluetoothPermission
  // - requestNotificationPermission
  // - scanCodeWithConfig
  // - isReady

  // Update return types for methods that now return nullables or booleans directly
  async isLoggedIn(): Promise<boolean> {
    console.log('Mock isLoggedIn check');
    return true; // Mock value
  }

  async isInClient(): Promise<boolean> {
    console.log('Mock isInClient check');
    return true; // Mock value
  }

   async scanCode(): Promise<LiffScanCode | null> {
     console.log('Mock scanCode');
     return Math.random() > 0.2 ? new LiffScanCode('mock-scan-result') : null;
   }

   async permission(permission: LiffPermission): Promise<LiffPermissionStatus> {
     console.log('Mock permission query:', permission.value);
     return new LiffPermissionStatus('granted'); // Mock value
   }

   async getFriendship(): Promise<LiffFriendship> {
     console.log('Mock getFriendship');
     return new LiffFriendship(true); // Mock value
   }

   async getIDToken(): Promise<LiffIdToken | null> {
     console.log('Mock getIDToken');
     return new LiffIdToken('mock_id_token'); // Mock value
   }

   async getContext(): Promise<LiffContext | null> {
     console.log('Mock getContext');
     return new LiffContext({ type: 'none', viewType: 'full' }); // Mock value
   }

   async getAccessToken(): Promise<LiffAccessToken | null> {
     console.log('Mock getAccessToken');
     return new LiffAccessToken('mock_access_token'); // Mock value
   }

   async getLineVersion(): Promise<LiffLineVersion | null> {
     console.log('Mock getLineVersion');
     return new LiffLineVersion('12.0.0'); // Mock value
   }

   async createPermanentLink(params: Record<string, string>): Promise<LiffPermanentLink | null> {
     console.log('Mock createPermanentLink:', params);
     return new LiffPermanentLink('https://liff.line.me/mock-link'); // Mock value
   }

   async requestAllPermissions(): Promise<void> {
     console.log('Mock requestAllPermissions');
   }

   async getId(): Promise<LiffId | null> {
     console.log('Mock getId');
     // Ensure mock ID format is valid if LiffId constructor validates it
     return new LiffId('1234567890123-abcdefghijklmnopqrstuvwx'); // Example valid format
   }

   async getDecodedIDToken(): Promise<LiffDecodedIdToken | null> {
     console.log('Mock getDecodedIDToken');
     return new LiffDecodedIdToken({
       iss: 'issuer',
       sub: 'subject',
       aud: 'audience',
       exp: Math.floor(Date.now() / 1000) + 3600,
       iat: Math.floor(Date.now() / 1000),
       auth_time: Math.floor(Date.now() / 1000),
       nonce: 'nonce',
       amr: ['pwd'],
       name: 'John Doe',
       picture: 'https://example.com/picture.jpg',
       email: 'john.doe@example.com',
     });
   }

   // Keep other existing mock methods...
   async initialize(config: LiffInitConfig): Promise<void> { console.log('Mock initialize:', config.value); }
   async getProfile(): Promise<LiffProfile> { console.log('Mock getProfile'); return new LiffProfile('userId', 'displayName', 'pictureUrl', 'statusMessage'); }
   async login(): Promise<void> { console.log('Mock login'); }
   async logout(): Promise<void> { console.log('Mock logout'); }
   async openShareTargetPicker(shareConfig: LiffShareTargetPicker): Promise<void> { console.log('Mock openShareTargetPicker:', shareConfig.value); }
   openWindow(windowConfig: LiffExternalWindow): void { console.log('Mock openWindow:', windowConfig.value); }
   closeWindow(): void { console.log('Mock closeWindow'); }
   async getVersion(): Promise<LiffVersion> { console.log('Mock getVersion'); return new LiffVersion('2.0.0'); }
   async getOs(): Promise<LiffOs> { console.log('Mock getOs'); return new LiffOs('web'); }
   async getLanguage(): Promise<LiffLanguage> { console.log('Mock getLanguage'); return new LiffLanguage('en'); }
   async getLocation(): Promise<LiffLocation> { console.log('Mock getLocation'); return new LiffLocation({ latitude: 0, longitude: 0 }); }
   async getDeviceState(): Promise<LiffDeviceState> { console.log('Mock getDeviceState'); return new LiffDeviceState({}); }
   async openUniversalLink(link: LiffUniversalLink): Promise<void> { console.log('Mock openUniversalLink:', link.value); }
   async isApiAvailable(apiName: string): Promise<LiffApiAvailability> { console.log('Mock isApiAvailable:', apiName); return new LiffApiAvailability(apiName, true); }
   async setLanguage(lang: LiffI18n): Promise<void> { console.log('Mock setLanguage:', lang.value); }
   async sendMessages(messages: LiffMessage): Promise<void> { console.log('Mock sendMessages:', messages.value); }
   async getAppLanguage(): Promise<LiffAppLanguage> { console.log('Mock getAppLanguage'); return new LiffAppLanguage('en'); }
   async usePlugin(plugin: LiffUse): Promise<void> { console.log('Mock usePlugin:', plugin.value); }
}
