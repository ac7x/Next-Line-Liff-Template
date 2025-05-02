/**
 * Retrieves LIFF configuration from environment variables.
 * Ensures that necessary configurations are available.
 */
export function getLiffConfig(): { liffId: string } {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (!liffId) {
    throw new Error(
      `環境變數 NEXT_PUBLIC_LIFF_ID 未設定。請檢查以下步驟：
      1. 確保 .env.local 文件中包含 NEXT_PUBLIC_LIFF_ID=您的 LIFF ID。
      2. 如果部署到雲端，請檢查環境變數是否正確配置。
      3. 確保應用程式已重新啟動以載入最新的環境變數。`
    );
  }

  return {
    liffId,
  };
}