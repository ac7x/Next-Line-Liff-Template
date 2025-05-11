import { LiffProfile as LiffSdkProfile } from '@/modules/liff/interfaces/client';

// 重用 client 中的型別定義，避免重複定義
export type ProfileProps = LiffSdkProfile;

// 用於 Server Actions 的型別，因為無法直接在服務器使用 LIFF SDK
export type ProfileServerDTO = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};
