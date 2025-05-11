import { ILiffService } from '@/modules/liff/domain/liff.service';
import { LiffAccessToken } from '@/modules/liff/domain/valueObjects/liff-access-token.value';
import { LiffApiAvailability } from '@/modules/liff/domain/valueObjects/liff-api-availability.value';
import { LiffAppLanguage } from '@/modules/liff/domain/valueObjects/liff-app-language.value';
import { LiffContext } from '@/modules/liff/domain/valueObjects/liff-context.value';
import { LiffDecodedIdToken } from '@/modules/liff/domain/valueObjects/liff-decoded-id-token.value';
import { LiffDeviceState } from '@/modules/liff/domain/valueObjects/liff-device-state.value';
import { LiffExternalWindow } from '@/modules/liff/domain/valueObjects/liff-external-window.value';
import { LiffFriendship } from '@/modules/liff/domain/valueObjects/liff-friendship.value'; // Added
import { LiffI18n } from '@/modules/liff/domain/valueObjects/liff-i18n.value';
import { LiffIdToken } from '@/modules/liff/domain/valueObjects/liff-id-token.value';
import { LiffId } from '@/modules/liff/domain/valueObjects/liff-id.value';
import { LiffInitConfig } from '@/modules/liff/domain/valueObjects/liff-init-config.value';
import { LiffLanguage } from '@/modules/liff/domain/valueObjects/liff-language.value';
import { LiffLineVersion } from '@/modules/liff/domain/valueObjects/liff-line-version.value';
import { LiffLocation } from '@/modules/liff/domain/valueObjects/liff-location.value';
import { LiffMessage } from '@/modules/liff/domain/valueObjects/liff-message.value';
import { LiffOs } from '@/modules/liff/domain/valueObjects/liff-os.value';
import { LiffPermanentLink } from '@/modules/liff/domain/valueObjects/liff-permanent-link.value';
import { LiffPermissionStatus } from '@/modules/liff/domain/valueObjects/liff-permission-status.value'; // Added
import { LiffPermission } from '@/modules/liff/domain/valueObjects/liff-permission.value';
import { LiffProfile } from '@/modules/liff/domain/valueObjects/liff-profile.value';
import { LiffScanCode } from '@/modules/liff/domain/valueObjects/liff-scan-code.value';
import { LiffShareTargetPicker } from '@/modules/liff/domain/valueObjects/liff-share-target-picker.value';
import { LiffUniversalLink } from '@/modules/liff/domain/valueObjects/liff-universal-link.value';
import { LiffUse } from '@/modules/liff/domain/valueObjects/liff-use.value';
import { LiffVersion } from '@/modules/liff/domain/valueObjects/liff-version.value';
import type { Liff, LiffPlugin } from '@line/liff'; // Import necessary types

// Use the domain type for PermissionStatus
type PermissionStatus = import('@/modules/liff/domain/valueObjects/liff-permission-status.value').PermissionStatus;

export class LiffServiceImpl implements ILiffService {
  private liffClient: Liff | undefined;
  private initPromise: Promise<void> | null = null; // Store the init promise

  constructor() {
    // LIFF SDK will be loaded dynamically
  }

  // Helper to get the LIFF client instance, loading it if necessary
  private async getLiffClientInstance(): Promise<Liff> {
    if (!this.liffClient) {
      this.liffClient = (await import('@line/liff')).default;
    }
    return this.liffClient;
  }

  // Helper to ensure LIFF is initialized before proceeding
  private async ensureInitialized(): Promise<Liff> {
    if (!this.initPromise) {
      throw new Error('LIFF is not initialized. Call initialize() first.');
    }
    
    try {
      // Wait for the existing initialization promise to complete
      await this.initPromise;
      
      // After initPromise resolves, liffClient should be set
      if (!this.liffClient) {
        throw new Error('LIFF client instance not available after initialization.');
      }

      // 檢查 LIFF 是否有 ready 屬性 (某些版本可能沒有)
      if (this.liffClient.ready && typeof this.liffClient.ready.then === 'function') {
        try {
          console.log('Waiting for LIFF.ready...');
          await Promise.race([
            this.liffClient.ready,
            new Promise((_, reject) => setTimeout(() => reject(new Error('LIFF.ready timeout')), 5000))
          ]);
          console.log('LIFF.ready resolved.');
        } catch (error) {
          console.warn('LIFF.ready timed out or failed, but proceeding anyway:', error);
          // 繼續執行，不要因為 ready 超時而中斷流程
        }
      }
      
      return this.liffClient;
    } catch (error) {
      console.error('Error ensuring LIFF initialization:', error);
      throw error;
    }
  }


  async initialize(config: LiffInitConfig): Promise<void> {
     // Prevent re-initialization
     if (this.initPromise) {
       console.warn('LIFF initialization already attempted.');
       return this.initPromise; // Return the existing promise
     }

     // Start initialization
     this.initPromise = (async () => {
       try {
         console.log('Loading LIFF SDK...');
         const liff = await this.getLiffClientInstance(); // Load LIFF SDK
         
         console.log(`Initializing LIFF with ID: ${config.value.liffId.substring(0, 8)}...`);
         await liff.init(config.value); // Initialize
         
         // 驗證初始化成功
         if (!liff.isInClient() && !liff.isLoggedIn()) {
           console.log('LIFF initialized in external browser, not logged in.');
         } else if (liff.isInClient()) {
           console.log('LIFF initialized in LINE app.');
         } else {
           console.log('LIFF initialized and user is logged in.');
         }
         
         console.log('LIFF initialized successfully.');
       } catch (error) {
         this.initPromise = null; // Reset promise on failure to allow retry
         console.error('LIFF initialization failed:', error);
         throw error; // Re-throw error to be caught by caller
       }
     })();

     return this.initPromise; // Return the promise without awaiting
   }

  async getProfile(): Promise<LiffProfile> {
    const liff = await this.ensureInitialized(); // Ensures init is done and ready
    const profile = await liff.getProfile();
    return new LiffProfile(
      profile.userId,
      profile.displayName,
      profile.pictureUrl,
      profile.statusMessage
    );
  }

  async login(): Promise<void> {
    // Ensure LIFF is initialized and ready before attempting login
    const liff = await this.ensureInitialized();
    if (!liff.isLoggedIn()) {
       // liff.login() handles the redirect/popup flow.
       liff.login();
    }
  }

  async logout(): Promise<void> {
    const liff = await this.ensureInitialized(); // Need to be initialized and logged in
    liff.logout(); // Synchronous call
  }

  async isLoggedIn(): Promise<boolean> {
    // This can be checked before full initialization might be complete.
    const liff = await this.getLiffClientInstance();
    return liff.isLoggedIn();
  }

  async isInClient(): Promise<boolean> {
    // This can also be checked before full initialization.
    const liff = await this.getLiffClientInstance();
    return liff.isInClient();
  }

  async openShareTargetPicker(shareConfig: LiffShareTargetPicker): Promise<void> {
    const liff = await this.ensureInitialized();
    if (liff.isApiAvailable('shareTargetPicker')) {
      await liff.shareTargetPicker(shareConfig.value);
    } else {
      console.warn('shareTargetPicker API is not available.');
      // Handle fallback or show message
    }
  }

  async scanCode(): Promise<LiffScanCode | null> {
    const liff = await this.ensureInitialized();
    if (liff.isApiAvailable('scanCode') && typeof liff.scanCode === 'function') {
      try {
        const result = await liff.scanCode();
        return result.value ? new LiffScanCode(result.value) : null;
      } catch (error: any) {
        if (error.code === 'USER_CANCEL' || error.code === 'PERMISSION_DENIED' || error.code === 'CAMERA_ERROR') {
          console.log(`Scan code failed or cancelled: ${error.code}`);
          return null;
        }
        console.error('Error scanning code:', error);
        throw error;
      }
    } else {
      console.warn('scanCode API is not available or method missing.');
      return null;
    }
  }


  openWindow(windowConfig: LiffExternalWindow): void {
    // Ensure LIFF is initialized and ready before opening window
    // Note: ensureInitialized is async, but openWindow is sync.
    // This implies openWindow should ideally be async or we risk race conditions
    // if called immediately after initialize without awaiting readiness elsewhere.
    // For now, let's log a warning if called before ready, but proceed.
    // A better approach might be to make openWindow async in the interface.
    if (!this.initPromise || !this.liffClient) {
        console.error('LIFF instance not available, cannot open window. Ensure initialize() was called and awaited.');
        throw new Error('LIFF instance not available');
    }

    // Check readiness synchronously if possible (liff.isReady() might not exist)
    // We rely on the caller (useLiff hook or application layer) to ensure readiness
    // before calling this synchronous method.
    // Let's proceed assuming readiness check happened upstream.

    // const liff = await this.ensureInitialized(); // Cannot await in sync method
    const liff = this.liffClient; // Use the existing client instance

    // Add a runtime check if possible, though liff.ready is async
    // This check is imperfect as `ready` might still be pending.
    // console.log('Attempting to open window. Ensure LIFF is ready.');

    liff.openWindow(windowConfig.value);
  }

  async permission(permission: LiffPermission): Promise<LiffPermissionStatus> {
    const liff = await this.ensureInitialized();
    const status = await liff.permission.query(permission.value as any) as unknown as PermissionStatus;
    return new LiffPermissionStatus(status);
  }

  closeWindow(): void {
    // closeWindow is synchronous
    const liff = this.liffClient;
     if (!liff) {
       console.error('LIFF instance not available, cannot close window.');
       throw new Error('LIFF instance not available');
     }
    liff.closeWindow();
  }

  async getFriendship(): Promise<LiffFriendship> {
    const liff = await this.ensureInitialized();
    const friendship = await liff.getFriendship();
    return new LiffFriendship(friendship.friendFlag);
  }

  async getVersion(): Promise<LiffVersion> {
    const liff = await this.getLiffClientInstance(); // Can be called before init finishes
    return new LiffVersion(liff.getVersion());
  }

  async getOs(): Promise<LiffOs> {
    const liff = await this.getLiffClientInstance();
    const os = liff.getOS();
    if (!os) {
        const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
        if (/android/i.test(ua)) return new LiffOs('android');
        if (/iPad|iPhone|iPod/.test(ua)) return new LiffOs('ios');
        return new LiffOs('web'); // Default
    }
    return new LiffOs(os);
  }

  async getLanguage(): Promise<LiffLanguage> {
    const liff = await this.getLiffClientInstance();
    const lang = liff.getLanguage();
     if (!lang) {
       return new LiffLanguage(typeof window !== 'undefined' ? navigator.language : 'en'); // Default
     }
    return new LiffLanguage(lang);
  }

  async getDeviceState(): Promise<LiffDeviceState> {
    const liff = await this.ensureInitialized();
    const state = {
       isVideoAutoPlay: liff.isApiAvailable('playVideo'),
       // Add other checks based on available APIs or context
    };
    return new LiffDeviceState(state);
  }

  // requestNotificationPermission removed
  // scanCodeWithConfig removed

  async openUniversalLink(link: LiffUniversalLink): Promise<void> {
    // Needs initialized LIFF to use openWindow reliably
    const liff = await this.ensureInitialized();
    liff.openWindow({
      url: link.value,
      external: true
    });
  }

  async getId(): Promise<LiffId | null> {
    // liff.id is available after init completes.
    const liff = await this.ensureInitialized();
    const liffId = liff.id;
    return liffId ? new LiffId(liffId) : null;
  }

  // isReady removed

  async getContext(): Promise<LiffContext | null> {
    const liff = await this.ensureInitialized();
    const context = liff.getContext();
    return context ? new LiffContext(context as any) : null;
  }

  async getIDToken(): Promise<LiffIdToken | null> {
    // Needs initialized LIFF
    const liff = await this.ensureInitialized();
    const token = liff.getIDToken();
    return token ? new LiffIdToken(token) : null;
  }

  async getDecodedIDToken(): Promise<LiffDecodedIdToken | null> {
    const liff = await this.ensureInitialized();
    const decodedToken = liff.getDecodedIDToken();
    if (!decodedToken) return null;
    if (typeof decodedToken.exp !== 'number' || typeof decodedToken.iat !== 'number') {
      console.error('Decoded ID token is missing required exp or iat fields.');
      return null;
    }
    return new LiffDecodedIdToken(decodedToken as {
        iss?: string;
        sub?: string;
        aud?: string;
        exp: number;
        iat: number;
        auth_time?: number;
        nonce?: string;
        amr?: string[];
        name?: string;
        picture?: string;
        email?: string;
      });
  }

  async getAccessToken(): Promise<LiffAccessToken | null> {
    const liff = await this.ensureInitialized();
    const token = liff.getAccessToken();
    return token ? new LiffAccessToken(token) : null;
  }

  async getLineVersion(): Promise<LiffLineVersion | null> {
    const liff = await this.getLiffClientInstance(); // Can be called before init
    const version = liff.getLineVersion();
    return version ? new LiffLineVersion(version) : null;
  }

  async isApiAvailable(apiName: string): Promise<LiffApiAvailability> {
    const liff = await this.getLiffClientInstance(); // Can be called before init
    return new LiffApiAvailability(apiName, liff.isApiAvailable(apiName as any));
  }

  async createPermanentLink(params: Record<string, string>): Promise<LiffPermanentLink | null> {
    const liff = await this.ensureInitialized();
    // Check if permanentLink API exists and has the method
    if (liff.permanentLink && typeof liff.permanentLink.createUrlBy === 'function') {
      try {
        const url: string = await liff.permanentLink.createUrlBy(params as any);
        return new LiffPermanentLink(url);
      } catch (error) {
         console.error('Error creating permanent link:', error);
         return null; // Return null on error
      }
    } else {
      console.warn('permanentLink.createUrlBy API is not available.');
      return null;
    }
  }


  async setLanguage(lang: LiffI18n): Promise<void> {
    const liff = await this.ensureInitialized();
    // Check if i18n API exists and has the method
    if (liff.i18n && typeof liff.i18n.setLang === 'function') {
       await liff.i18n.setLang(lang.value as any);
    } else {
       console.warn('i18n.setLang API is not available.');
    }
  }

  async sendMessages(messages: LiffMessage): Promise<void> {
    const liff = await this.ensureInitialized();
     if (liff.isApiAvailable('sendMessages')) {
        await liff.sendMessages(messages.value);
     } else {
       console.warn('sendMessages API is not available.');
       // Handle fallback or show message
     }
  }

  async requestAllPermissions(): Promise<void> {
    const liff = await this.ensureInitialized();
    // Check if permission API exists and has the method
    if (liff.permission && typeof liff.permission.requestAll === 'function') {
       await liff.permission.requestAll();
    } else {
       console.warn('permission.requestAll API is not available.');
    }
  }

  async getAppLanguage(): Promise<LiffAppLanguage> {
    const liff = await this.getLiffClientInstance(); // Can be called before init
    const lang = liff.getLanguage();
     if (!lang) {
       return new LiffAppLanguage(typeof window !== 'undefined' ? navigator.language : 'en'); // Default
     }
    return new LiffAppLanguage(lang);
  }

  async usePlugin(plugin: LiffUse): Promise<void> {
    const liff = await this.getLiffClientInstance(); // Get client, plugin should be installed early
    await liff.use(plugin.value as LiffPlugin<any>);
  }

  // requestBluetoothPermission removed

  async getLocation(): Promise<LiffLocation> {
    // No LIFF dependency, but ensure context if needed? For now, keep as is.
    // const liff = await this.ensureInitialized(); // Potentially ensure LIFF context
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by this browser.'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(new LiffLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          // Map error codes to more specific errors if needed
          reject(new Error(`Geolocation error: ${error.message} (Code: ${error.code})`));
        }
      );
    });
  }
}
