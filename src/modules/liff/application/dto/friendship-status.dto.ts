import { z } from 'zod';

/**
 * 使用者與 LINE Bot 的好友關係狀態 DTO Schema
 */
export const FriendshipStatusDTOSchema = z.object({
  userId: z.string(),
  isFriend: z.boolean()
});

/**
 * 使用者與 LINE Bot 的好友關係狀態 DTO
 */
export type FriendshipStatusDTO = z.infer<typeof FriendshipStatusDTOSchema>;
