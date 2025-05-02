import liff from '@line/liff';

// 型別定義
export type LiffInitOptions = {
  liffId: string;
  withLoginOnExternalBrowser?: boolean;
};

export type OpenWindowParams = {
  url: string;
  external?: boolean;
};

export type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export type IdTokenPayload = {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  nonce?: string;
  name?: string;
  picture?: string;
  email?: string;
  [key: string]: any;
};

export type TextMessage = {
  type: 'text';
  text: string;
};

export type ImageMessage = {
  type: 'image';
  originalContentUrl: string;
  previewImageUrl: string;
};

export type VideoMessage = {
  type: 'video';
  originalContentUrl: string;
  previewImageUrl: string;
};

export type AudioMessage = {
  type: 'audio';
  originalContentUrl: string;
  duration: number;
};

export type LocationMessage = {
  type: 'location';
  title: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type LiffMessage =
  | TextMessage
  | ImageMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage;
export type ShareTargetPickerMessage = LiffMessage;
export type ShareTargetPickerResult = {
  status: string;
  [key: string]: any;
};

export type LiffContext = {
  type: string;
  viewType: 'compact' | 'full' | 'tall' | 'frame' | 'full-flex'; // 添加更多有效的 viewType
  userId?: string;
  utouId?: string;
  groupId?: string;
  roomId?: string;
  [key: string]: any;
} | null;

export type Permission = 'email' | 'profile' | 'chat_message.write' | 'openid';
export type PermissionStatus = 'unavailable' | 'denied' | 'granted' | 'prompt';

export type PermanentLinkOptions = {
  baseUrl?: string;
};

// LIFF 客戶端封裝
const LiffClient = {
  // 初始化與狀態
  init: async ({ liffId, withLoginOnExternalBrowser = false }: LiffInitOptions): Promise<void> => {
    try {
      await liff.init({ liffId, withLoginOnExternalBrowser });
      console.log('LIFF initialized successfully');
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      throw error;
    }
  },

  // Ready 狀態相關
  isReady: (): Promise<void> => liff.ready,
  onReady: (callback: () => void): void => {
    liff.ready.then(callback);
  },
  waitForReady: async (): Promise<void> => liff.ready,

  // 登入相關
  login: async (redirectUri?: string): Promise<void> => liff.login({ redirectUri }),
  logout: (): void => liff.logout(),
  isLoggedIn: (): boolean => liff.isLoggedIn(),

  // 環境相關
  isInClient: (): boolean => liff.isInClient(),
  getOS: (): string | undefined => liff.getOS(),
  getLanguage: (): string => liff.getLanguage(),
  getVersion: (): string => liff.getVersion(),
  getLineVersion: (): string | null => liff.getLineVersion(),

  // 用戶資訊相關
  getProfile: async (): Promise<LiffProfile> => {
    try {
      return await liff.getProfile();
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  getFriendship: async (): Promise<{ friendFlag: boolean }> => {
    try {
      return await liff.getFriendship();
    } catch (error) {
      console.error('Error getting friendship:', error);
      throw error;
    }
  },

  getAccessToken: (): string | null => {
    try {
      return liff.getAccessToken();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  getDecodedIDToken: (): IdTokenPayload | null => {
    try {
      return liff.getDecodedIDToken();
    } catch (error) {
      console.error('Error getting decoded ID token:', error);
      return null;
    }
  },

  // 訊息相關
  sendMessages: async (messages: LiffMessage[]): Promise<void> => {
    try {
      await liff.sendMessages(messages);
    } catch (error) {
      console.error('Error sending messages:', error);
      throw error;
    }
  },

  shareTargetPicker: async (
    messages: ShareTargetPickerMessage[]
  ): Promise<ShareTargetPickerResult | null> => {
    try {
      if (!liff.isApiAvailable('shareTargetPicker')) {
        console.warn('ShareTargetPicker API is not available');
        return null;
      }

      const result = await liff.shareTargetPicker(messages);
      return result || null;
    } catch (error) {
      console.error('Error using shareTargetPicker:', error);
      throw error;
    }
  },

  isShareTargetPickerAvailable: (): boolean => liff.isApiAvailable('shareTargetPicker'),

  // 功能性操作
  openWindow: ({ url, external = false }: OpenWindowParams): void => {
    liff.openWindow({ url, external });
  },

  closeWindow: (): void => {
    liff.closeWindow();
  },

  scanCode: async (): Promise<string | null> => {
    try {
      const result = await liff.scanCodeV2();
      return result?.value || null;
    } catch (error) {
      console.error('Error scanning code:', error);
      throw error;
    }
  },

  // Context 相關
  getContext: (): LiffContext => {
    try {
      const context = liff.getContext();
      return context
        ? {
            ...context,
            viewType: context.viewType || 'compact', // 提供預設值
          }
        : null;
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
    }
  },

  // AId 相關
  getAId: (): string | null | undefined => {
    try {
      const aid = liff.getAId();
      if (!aid) return null;
      return typeof aid === 'string' ? aid : aid.toString();
    } catch (error) {
      console.error('Error getting AId:', error);
      return null;
    }
  },

  // Permanent Link 相關
  getPermanentLink: async (): Promise<string> => liff.permanentLink.createUrl(),
  createUrlBy: async (baseUrl: string): Promise<string> => liff.permanentLink.createUrlBy(baseUrl),

  // Permission 相關
  permission: {
    query: async (permission: Permission): Promise<PermissionStatus> => {
      try {
        const status = await liff.permission.query(permission);
        return status as unknown as PermissionStatus; // 先轉換為 unknown 再轉換為目標型別
      } catch (error) {
        console.error('Error querying permission:', error);
        throw error;
      }
    },
    requestAll: async (): Promise<void> => {
      try {
        await liff.permission.requestAll();
      } catch (error) {
        console.error('Error requesting permissions:', error);
        throw error;
      }
    },
  },

  // API 可用性檢查
  isApiAvailable: (apiName: string): boolean => liff.isApiAvailable(apiName),
};

// 單獨導出各個功能，便於有選擇地引入
export const init = LiffClient.init;
export const isReady = LiffClient.isReady;
export const onReady = LiffClient.onReady;
export const waitForReady = LiffClient.waitForReady;
export const login = LiffClient.login;
export const logout = LiffClient.logout;
export const isLoggedIn = LiffClient.isLoggedIn;
export const isInClient = LiffClient.isInClient;
export const getOS = LiffClient.getOS;
export const getLanguage = LiffClient.getLanguage;
export const getVersion = LiffClient.getVersion;
export const getLineVersion = LiffClient.getLineVersion;
export const getProfile = LiffClient.getProfile;
export const getFriendship = LiffClient.getFriendship;
export const getAccessToken = LiffClient.getAccessToken;
export const getDecodedIDToken = LiffClient.getDecodedIDToken;
export const sendMessages = LiffClient.sendMessages;
export const shareTargetPicker = LiffClient.shareTargetPicker;
export const isShareTargetPickerAvailable = LiffClient.isShareTargetPickerAvailable;
export const openWindow = LiffClient.openWindow;
export const closeWindow = LiffClient.closeWindow;
export const scanCode = LiffClient.scanCode;
export const getContext = LiffClient.getContext;
export const getAId = LiffClient.getAId;
export const getPermanentLink = LiffClient.getPermanentLink;
export const createUrlBy = LiffClient.createUrlBy;
export const permission = LiffClient.permission;
export const isApiAvailable = LiffClient.isApiAvailable;

// 預設導出
export default LiffClient;
