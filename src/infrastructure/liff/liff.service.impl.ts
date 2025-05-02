import { ILiffService } from '@/domain/liff/liff.service';
import { LiffAccessToken } from '@/domain/liff/valueObjects/liff-access-token.value';
import { LiffApiAvailability } from '@/domain/liff/valueObjects/liff-api-availability.value';
import { LiffAppLanguage } from '@/domain/liff/valueObjects/liff-app-language.value';
import { LiffContext } from '@/domain/liff/valueObjects/liff-context.value';
import { LiffDecodedIdToken } from '@/domain/liff/valueObjects/liff-decoded-id-token.value';
import { LiffDeviceState } from '@/domain/liff/valueObjects/liff-device-state.value';
import { LiffExternalWindow } from '@/domain/liff/valueObjects/liff-external-window.value';
import { LiffFriendship } from '@/domain/liff/valueObjects/liff-friendship.value'; // Added
import { LiffI18n } from '@/domain/liff/valueObjects/liff-i18n.value';
import { LiffIdToken } from '@/domain/liff/valueObjects/liff-id-token.value';
import { LiffId } from '@/domain/liff/valueObjects/liff-id.value';
import { LiffInitConfig } from '@/domain/liff/valueObjects/liff-init-config.value';
import { LiffLanguage } from '@/domain/liff/valueObjects/liff-language.value';
import { LiffLineVersion } from '@/domain/liff/valueObjects/liff-line-version.value';
import { LiffLocation } from '@/domain/liff/valueObjects/liff-location.value';
import { LiffMessage } from '@/domain/liff/valueObjects/liff-message.value';
import { LiffOs } from '@/domain/liff/valueObjects/liff-os.value';
import { LiffPermanentLink } from '@/domain/liff/valueObjects/liff-permanent-link.value';
import { LiffPermissionStatus } from '@/domain/liff/valueObjects/liff-permission-status.value'; // Added
import { LiffPermission } from '@/domain/liff/valueObjects/liff-permission.value';
import { LiffProfile } from '@/domain/liff/valueObjects/liff-profile.value';
import { LiffScanCode } from '@/domain/liff/valueObjects/liff-scan-code.value';
import { LiffShareTargetPicker } from '@/domain/liff/valueObjects/liff-share-target-picker.value';
import { LiffUniversalLink } from '@/domain/liff/valueObjects/liff-universal-link.value';
import { LiffUse } from '@/domain/liff/valueObjects/liff-use.value';
import { LiffVersion } from '@/domain/liff/valueObjects/liff-version.value';
import type { Liff, LiffPlugin } from '@line/liff'; // Import necessary types

// Use the domain type for PermissionStatus
type PermissionStatus = import('@/domain/liff/valueObjects/liff-permission-status.value').PermissionStatus;

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
    // Wait for the existing initialization promise to complete
    await this.initPromise;
    // After initPromise resolves, liffClient should be set
    if (!this.liffClient) {
        // This case should ideally not happen if initPromise resolved successfully
        throw new Error('LIFF client instance not available after initialization.');
    }
    // Although initPromise resolved, liff.ready might still be pending internally
    // Awaiting liff.ready ensures all internal setup is complete
    await this.liffClient.ready;
    return this.liffClient;
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
         const liff = await this.getLiffClientInstance(); // Load LIFF SDK
         await liff.init(config.value); // Initialize
         // No need to await liff.ready here, ensureInitialized will handle it
         console.log('LIFF initialized successfully via liff.init().');
       } catch (error) {
         this.initPromise = null; // Reset promise on failure to allow retry?
         console.error('LIFF initialization failed:', error);
         throw error; // Re-throw error to be caught by caller
       }
     })();

     await this.initPromise; // Wait for the initialization process to complete
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
    // Login might be called before init finishes, but LIFF SDK handles this.
    // We need the instance first.
    const liff = await this.getLiffClientInstance();
    // We don't necessarily need to wait for ensureInitialized here,
    // as liff.login() itself might trigger necessary setup or wait.
    // However, calling ensureInitialized provides consistency.
    // Let's try without ensureInitialized first for minimal code.
    // await this.ensureInitialized(); // Optional: ensures full init before login attempt
    if (!liff.isLoggedIn()) {
       // liff.login() handles the redirect/popup flow.
       // No need to await if it causes a page reload.
       liff.login();
       // If login doesn't reload, you might need to await and handle the result.
       // await liff.login();
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
    // openWindow is synchronous and might be called before full init.
    const liff = this.liffClient; // Get potentially uninitialized client
    if (!liff) {
       // It's safer to ensure the instance exists, even if not fully ready.
       // Throwing an error might be too strict if called early.
       console.error('LIFF instance not available, cannot open window. Ensure initialize() was called.');
       // Alternative: Queue the call or throw. Let's throw for now.
       throw new Error('LIFF instance not available');
    }
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
