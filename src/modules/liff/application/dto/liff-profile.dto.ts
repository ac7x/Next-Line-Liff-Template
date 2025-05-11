import { LiffProfile as LiffSdkProfile } from '@/modules/liff/interfaces/client';
import { z } from 'zod';

// 重用 client 中的型別定義，避免重複定義
export type ProfileProps = LiffSdkProfile;

// 定義用於 API 響應的 DTO
export const LiffProfileResponseDTOSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  pictureUrl: z.string().optional(),
  statusMessage: z.string().optional(),
  isFriend: z.boolean().optional()
});

export type LiffProfileResponseDTO = z.infer<typeof LiffProfileResponseDTOSchema>;

// 用於 Server 端內部傳遞的 DTO
export const LiffProfileServerDTOSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  pictureUrl: z.string().optional(),
  statusMessage: z.string().optional()
});

export type LiffProfileServerDTO = z.infer<typeof LiffProfileServerDTOSchema>;
