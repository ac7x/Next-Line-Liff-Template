# LIFF Client Interface

此模組封裝了 [LINE Front-end Framework (LIFF)](https://developers.line.biz/en/docs/liff/) 的常用功能，提供了一個易於使用的介面，並包含完整的型別定義以確保代碼的型別安全性。

## 功能列表

以下是 `src/interfaces/liff/client/index.ts` 提供的主要功能：

### 初始化與狀態
- `init(options: LiffInitOptions): Promise<void>`  
  初始化 LIFF 應用。

- `isReady(): Promise<void>`  
  檢查 LIFF 是否已準備就緒。

- `onReady(callback: () => void): void`  
  設置當 LIFF 準備就緒時的回調函數。

- `waitForReady(): Promise<void>`  
  等待 LIFF 準備就緒。

### 登入與登出
- `login(redirectUri?: string): Promise<void>`  
  登入 LIFF。

- `logout(): void`  
  登出 LIFF。

- `isLoggedIn(): boolean`  
  檢查用戶是否已登入。

### 環境檢查
- `isInClient(): boolean`  
  檢查是否在 LINE 客戶端內運行。

- `getOS(): string | undefined`  
  獲取當前操作系統。

- `getLanguage(): string`  
  獲取當前語言。

- `getVersion(): string`  
  獲取 LIFF SDK 版本。

- `getLineVersion(): string | null`  
  獲取 LINE 客戶端版本。

### 用戶資訊
- `getProfile(): Promise<LiffProfile>`  
  獲取用戶的個人資料。

- `getFriendship(): Promise<{ friendFlag: boolean }>`  
  獲取用戶與 LINE 官方帳號的好友狀態。

- `getAccessToken(): string | null`  
  獲取當前的 Access Token。

- `getDecodedIDToken(): IdTokenPayload | null`  
  獲取解碼後的 ID Token。

### 訊息相關
- `sendMessages(messages: LiffMessage[]): Promise<void>`  
  發送訊息給用戶。

- `shareTargetPicker(messages: ShareTargetPickerMessage[]): Promise<ShareTargetPickerResult | null>`  
  使用分享目標選擇器分享訊息。

- `isShareTargetPickerAvailable(): boolean`  
  檢查分享目標選擇器是否可用。

### 功能性操作
- `openWindow(params: OpenWindowParams): void`  
  開啟新視窗。

- `closeWindow(): void`  
  關閉當前視窗。

- `scanCode(): Promise<string | null>`  
  掃描 QR Code。

### Context 相關
- `getContext(): LiffContext`  
  獲取當前 LIFF 的上下文。

### AId 相關
- `getAId(): string | null | undefined`  
  獲取 AId（應用 ID）。

### Permanent Link 相關
- `getPermanentLink(): Promise<string>`  
  獲取永久連結。

- `createUrlBy(baseUrl: string): Promise<string>`  
  根據基礎 URL 創建永久連結。

### Permission 相關
- `permission.query(permission: Permission): Promise<PermissionStatus>`  
  查詢指定權限的狀態。

- `permission.requestAll(): Promise<void>`  
  請求所有權限。

### API 可用性檢查
- `isApiAvailable(apiName: string): boolean`  
  檢查指定的 API 是否可用。

## 使用方式

### 安裝
確保已安裝 `@line/liff` 套件：
```bash
npm install @line/liff
```

### 引入模組
```typescript
import LiffClient, { init, login, getProfile } from './index';
```

### 初始化 LIFF
```typescript
await init({ liffId: 'YOUR_LIFF_ID' });
```

### 獲取用戶資料
```typescript
if (LiffClient.isLoggedIn()) {
  const profile = await getProfile();
  console.log('User Profile:', profile);
} else {
  login();
}
```

### 發送訊息
```typescript
await LiffClient.sendMessages([
  { type: 'text', text: 'Hello, this is a test message!' }
]);
```

## 注意事項
- 確保在使用任何功能前調用 `init` 方法完成初始化。
- 部分功能需要在 LINE 客戶端內運行，請使用 `isInClient` 方法進行檢查。
- 使用 `isApiAvailable` 方法檢查 API 是否可用，以避免運行時錯誤。

# 使用最佳實踐

## 在 Context 中使用
建議在 React Context 中初始化 LIFF 並管理其狀態，確保應用的其他部分可以輕鬆訪問 LIFF 的功能。

```typescript
import { createContext, useContext } from 'react';
import LiffClient from './index';

const LiffContext = createContext(null);

export function LiffProvider({ children }) {
  // 初始化和狀態管理邏輯
  return <LiffContext.Provider value={/* context value */}>{children}</LiffContext.Provider>;
}

export function useLiff() {
  return useContext(LiffContext);
}
```

## 在 Server Actions 中使用
由於 Server Actions 無法直接調用 LIFF SDK，建議通過封裝的接口傳遞必要的數據。

```typescript
import { saveUserProfile } from '@/application/liff/actions/liffActions';

export async function handleSaveProfile() {
  const result = await saveUserProfile();
  console.log('Profile saved:', result);
}
```

## 錯誤處理
建議在調用 LIFF 方法時，統一捕獲錯誤並記錄，避免應用崩潰。

```typescript
try {
  const profile = await LiffClient.getProfile();
  console.log('Profile:', profile);
} catch (error) {
  console.error('Error fetching profile:', error);
}
```

## 聯繫方式
如需更多幫助，請參考 [LINE 官方文檔](https://developers.line.biz/en/docs/liff/overview/)。
