import { z } from 'zod';

// 定義命令模型
export const SaveUserProfileCommandSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  displayName: z.string().min(1, 'Display name is required'),
  pictureUrl: z.string().optional(),
  statusMessage: z.string().optional(),
});

// 命令類型
export type SaveUserProfileCommand = z.infer<typeof SaveUserProfileCommandSchema>;

// 命令處理結果
export type SaveUserProfileResult = {
  success: boolean;
  userId?: string;
  message?: string;
};
