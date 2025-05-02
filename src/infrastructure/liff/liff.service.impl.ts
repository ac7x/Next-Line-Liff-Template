import { ILiffService } from '@/domain/liff/liff.service';
import { LiffAccessToken } from '@/domain/liff/valueObjects/liff-access-token.value';
import { LiffApiAvailability } from '@/domain/liff/valueObjects/liff-api-availability.value';
import { LiffAppLanguage } from '@/domain/liff/valueObjects/liff-app-language.value';
// import { LiffBluetoothPermission } from '@/domain/liff/valueObjects/liff-bluetooth-permission.value'; // Removed
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
// import { LiffNotificationPermission } from '@/domain/liff/valueObjects/liff-notification-permission.value'; // Removed
import { LiffOs } from '@/domain/liff/valueObjects/liff-os.value';
import { LiffPermanentLink } from '@/domain/liff/valueObjects/liff-permanent-link.value';
import { LiffPermissionStatus } from '@/domain/liff/valueObjects/liff-permission-status.value'; // Added
import { LiffPermission } from '@/domain/liff/valueObjects/liff-permission.value';
import { LiffProfile } from '@/domain/liff/valueObjects/liff-profile.value';
// import { LiffReady } from '@/domain/liff/valueObjects/liff-ready.value'; // Removed
// import { LiffScanCodeConfig } from '@/domain/liff/valueObjects/liff-scan-code-config.value'; // Removed
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
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // LIFF SDK will be loaded dynamically
  }

  // Added back the private helper method
  private async getLiffClient(): Promise<Liff> {
    if (!this.liffClient) {
      // Dynamically import the LIFF SDK if it hasn't been loaded yet
      this.liffClient = (await import('@line/liff')).default;
    }
    return this.liffClient;
  }

  // Ensure LIFF is loaded and initialized
  private async ensureInitialized(): Promise<Liff> {
    if (this.liffClient && this.liffClient.ready) {
      // Already initialized (or initialization promise resolved)
      await this.liffClient.ready; // Ensure the promise is resolved
      return this.liffClient;
    }

    if (this.isInitializing && this.initializationPromise) {
      // Initialization is in progress, wait for it
      await this.initializationPromise;
      if (!this.liffClient) throw new Error('LIFF initialization failed.');
      return this.liffClient;
    }

    // Start initialization
    this.isInitializing = true;
    this.initializationPromise = (async () => {
      try {
        const liff = await this.getLiffClient(); // Use the helper method
        // If init wasn't called yet, this might just wait indefinitely
        // Ensure initialize is called before methods needing full init
        await liff.ready;
      } catch (error) {
        this.isInitializing = false;
        this.initializationPromise = null;
        console.error('LIFF ensureInitialized failed:', error);
        throw new Error('LIFF ensureInitialized failed.');
      } finally {
        this.isInitializing = false;
        // Keep initializationPromise resolved so subsequent calls don't re-init
      }
    })();

    await this.initializationPromise;
    if (!this.liffClient) throw new Error('LIFF initialization failed.');
    return this.liffClient;
  }


  async initialize(config: LiffInitConfig): Promise<void> {
     if (this.liffClient || this.isInitializing) {
       console.warn('LIFF already initializing or initialized.');
       await this.ensureInitialized(); // Wait if already initializing
       return;
     }

     this.isInitializing = true;
     this.initializationPromise = (async () => {
       try {
         const liff = await this.getLiffClient(); // Use helper
         await liff.init(config.value);
         console.log('LIFF initialized successfully.');
       } catch (error) {
         this.isInitializing = false;
         this.initializationPromise = null; // Reset on failure
         console.error('LIFF initialization failed:', error);
         throw error; // Re-throw error
       } finally {
         this.isInitializing = false;
         // Keep initializationPromise resolved after success
       }
     })();
     await this.initializationPromise;
   }

  async getProfile(): Promise<LiffProfile> {
    const liff = await this.ensureInitialized();
    const profile = await liff.getProfile();
    return new LiffProfile(
      profile.userId,
      profile.displayName,
      profile.pictureUrl,
      profile.statusMessage
    );
  }

  async login(): Promise<void> {
    // ensureInitialized might not be sufficient if login is called before init finishes
    // Let LIFF SDK handle the state, or add more robust state management
    const liff = await this.getLiffClient(); // Use getLiffClient to ensure it's loaded
    if (!liff.isLoggedIn()) {
       await liff.login();
    }
  }

  async logout(): Promise<void> {
    const liff = await this.ensureInitialized();
    liff.logout();
  }

  async isLoggedIn(): Promise<boolean> { // Changed return type
    const liff = await this.getLiffClient(); // Get client without ensuring init is fully done yet
    return liff.isLoggedIn();
  }

  async isInClient(): Promise<boolean> { // Changed return type
    const liff = await this.getLiffClient();
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

  async scanCode(): Promise<LiffScanCode | null> { // Changed return type
    const liff = await this.ensureInitialized();
    // Check if API and method exist
    if (liff.isApiAvailable('scanCode') && typeof liff.scanCode === 'function') {
      try {
        // Note: liff.scanCode() returns Promise<{ value: string | null }>
        const result = await liff.scanCode(); // scanCode v2 returns object
        return result.value ? new LiffScanCode(result.value) : null;
      } catch (error: any) {
        // Handle specific errors, e.g., user cancellation
        if (error.code === 'USER_CANCEL') {
          console.log('Scan code cancelled by user.');
          return null;
        }
        console.error('Error scanning code:', error);
        throw error; // Re-throw other errors
      }
    } else {
      console.warn('scanCode API is not available or method missing.');
      return null;
    }
  }


  openWindow(windowConfig: LiffExternalWindow): void {
    // openWindow is synchronous according to docs
    const liff = this.liffClient; // Get potentially uninitialized client
    if (!liff) {
       console.error('LIFF not loaded, cannot open window.');
       // Optionally throw error or handle differently
       throw new Error('LIFF is not loaded');
       // return;
    }
    liff.openWindow(windowConfig.value);
  }

  async permission(permission: LiffPermission): Promise<LiffPermissionStatus> { // Changed return type
    const liff = await this.ensureInitialized();
    // Use type assertion for the input due to potential SDK type mismatch in error message
    // Use 'unknown' assertion for the output status as recommended by TS2352
    const status = await liff.permission.query(permission.value as any) as unknown as PermissionStatus;
    return new LiffPermissionStatus(status);
  }

  closeWindow(): void {
    // closeWindow is synchronous
    const liff = this.liffClient;
     if (!liff) {
       console.error('LIFF not loaded, cannot close window.');
       throw new Error('LIFF is not loaded');
     }
    liff.closeWindow();
  }

  async getFriendship(): Promise<LiffFriendship> { // Changed return type
    const liff = await this.ensureInitialized();
    const friendship = await liff.getFriendship();
    return new LiffFriendship(friendship.friendFlag);
  }

  async getVersion(): Promise<LiffVersion> {
    const liff = await this.getLiffClient(); // Can be called before init finishes
    return new LiffVersion(liff.getVersion());
  }

  async getOs(): Promise<LiffOs> {
    const liff = await this.getLiffClient();
    // LIFF's getOS() can return undefined before init, handle it
    const os = liff.getOS();
    if (!os) {
        // Attempt to determine OS from user agent as a fallback, or default
        const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
        if (/android/i.test(ua)) return new LiffOs('android');
        if (/iPad|iPhone|iPod/.test(ua)) return new LiffOs('ios');
        return new LiffOs('web'); // Default
    }
    return new LiffOs(os);
  }

  async getLanguage(): Promise<LiffLanguage> {
    const liff = await this.getLiffClient();
    // getLanguage can return undefined before init
    const lang = liff.getLanguage();
     if (!lang) {
       return new LiffLanguage(typeof window !== 'undefined' ? navigator.language : 'en'); // Default
     }
    return new LiffLanguage(lang);
  }

  async getDeviceState(): Promise<LiffDeviceState> {
    const liff = await this.ensureInitialized();
    // Reimplement using isApiAvailable or other checks if needed
    // For now, return an empty state or based on basic checks
    const state = {
       isVideoAutoPlay: liff.isApiAvailable('playVideo'), // Example check
       // Add other checks based on available APIs or context
    };
    return new LiffDeviceState(state);
  }

  // requestNotificationPermission removed

  // scanCodeWithConfig removed

  async openUniversalLink(link: LiffUniversalLink): Promise<void> {
    const liff = await this.ensureInitialized();
    // Use openWindow for universal links as well, external: true might not be needed
    // depending on the desired behavior (stay in LIFF browser vs open external app)
    liff.openWindow({
      url: link.value,
      external: true // Open in external browser/app if possible
    });
  }

  async getId(): Promise<LiffId | null> { // Changed return type
    const liff = await this.ensureInitialized();
    const liffId = liff.id; // liff.id should be available after init
    return liffId ? new LiffId(liffId) : null;
  }

  // isReady removed

  async getContext(): Promise<LiffContext | null> { // Changed return type
    const liff = await this.ensureInitialized();
    const context = liff.getContext();
    // Ensure context matches the updated LiffContext value object structure
    return context ? new LiffContext(context as any) : null; // Use 'as any' or map properties carefully
  }

  async getIDToken(): Promise<LiffIdToken | null> { // Changed return type
    const liff = await this.ensureInitialized();
    const token = liff.getIDToken();
    // Don't throw error, return null as per interface
    return token ? new LiffIdToken(token) : null;
  }

  async getDecodedIDToken(): Promise<LiffDecodedIdToken | null> { // Changed return type
    const liff = await this.ensureInitialized();
    const decodedToken = liff.getDecodedIDToken();
    if (!decodedToken) return null;
    // Add checks for required fields before creating the value object
    if (typeof decodedToken.exp !== 'number' || typeof decodedToken.iat !== 'number') {
      console.error('Decoded ID token is missing required exp or iat fields.');
      return null; // Or throw an error if these are critical
    }
    // Payload matches LiffDecodedIdToken constructor (which allows optionals now)
    // Use type assertion to satisfy the constructor parameter type
    return new LiffDecodedIdToken(decodedToken as {
        iss?: string;
        sub?: string;
        aud?: string;
        exp: number; // Ensure exp is number here
        iat: number; // Ensure iat is number here
        auth_time?: number;
        nonce?: string;
        amr?: string[];
        name?: string;
        picture?: string;
        email?: string;
      });
  }

  async getAccessToken(): Promise<LiffAccessToken | null> { // Changed return type
    const liff = await this.ensureInitialized();
    const token = liff.getAccessToken();
    // Don't throw error, return null as per interface
    return token ? new LiffAccessToken(token) : null;
  }

  async getLineVersion(): Promise<LiffLineVersion | null> { // Changed return type
    const liff = await this.getLiffClient(); // Can be called before init
    const version = liff.getLineVersion();
    return version ? new LiffLineVersion(version) : null;
  }

  async isApiAvailable(apiName: string): Promise<LiffApiAvailability> {
    const liff = await this.getLiffClient(); // Can be called before init
    // LIFF SDK requires specific API names, ensure apiName is valid
    // For simplicity, assume apiName is valid
    return new LiffApiAvailability(apiName, liff.isApiAvailable(apiName as any));
  }

  async createPermanentLink(params: Record<string, string>): Promise<LiffPermanentLink | null> { // Changed return type
    const liff = await this.ensureInitialized();
    if (liff.permanentLink && typeof liff.permanentLink.createUrlBy === 'function') {
      // Await the promise returned by createUrlBy
      // Use type assertion for params due to potential SDK type mismatch
      const url: string = await liff.permanentLink.createUrlBy(params as any);
      return new LiffPermanentLink(url);
    } else {
      console.warn('permanentLink.createUrlBy API is not available.');
      return null;
    }
  }

  async setLanguage(lang: LiffI18n): Promise<void> {
    const liff = await this.ensureInitialized();
    // Use type assertion as lang.value (string) might not match the specific union type expected by setLang
    await liff.i18n.setLang(lang.value as any);
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

  async requestAllPermissions(): Promise<void> { // Changed return type
    const liff = await this.ensureInitialized();
    // This requests 'profile', 'openid', 'email', 'chat_message.write'
    await liff.permission.requestAll();
  }

  async getAppLanguage(): Promise<LiffAppLanguage> {
    // Similar to getLanguage, handle potential undefined before init
    const liff = await this.getLiffClient();
    const lang = liff.getLanguage();
     if (!lang) {
       return new LiffAppLanguage(typeof window !== 'undefined' ? navigator.language : 'en'); // Default
     }
    return new LiffAppLanguage(lang);
  }

  async usePlugin(plugin: LiffUse): Promise<void> {
    const liff = await this.getLiffClient(); // Get client, plugin should be installed early
    // Provide generic type argument for LiffPlugin
    await liff.use(plugin.value as LiffPlugin<any>);
  }

  // requestBluetoothPermission removed

  async getLocation(): Promise<LiffLocation> {
    // Use standard Geolocation API
    const liff = await this.ensureInitialized(); // Ensure LIFF context if needed
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
          reject(error);
        }
      );
    });
  }
}
