/**
 * Retrieves LIFF configuration from environment variables.
 * Ensures that necessary configurations are available.
 */
export function getLiffConfig(): { liffId: string } {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (!liffId) {
    throw new Error(
      'NEXT_PUBLIC_LIFF_ID 環境變數未設定。請檢查您的 .env.local 文件或環境設定，並確保包含正確的 LIFF ID。'
    );
  }

  return {
    liffId,
  };
}