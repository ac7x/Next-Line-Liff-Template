import { z } from 'zod';

// 定義查詢模型
export const GetUserProfileQuerySchema = z.object({
  userId: z.string().min(1, 'User ID is required')
});

export type GetUserProfileQuery = z.infer<typeof GetUserProfileQuerySchema>;
