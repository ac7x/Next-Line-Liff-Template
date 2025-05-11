import { z } from 'zod';

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
