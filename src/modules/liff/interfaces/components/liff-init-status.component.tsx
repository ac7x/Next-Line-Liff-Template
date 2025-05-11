interface LiffInitStatusProps {
  isInitialized: boolean;
  error?: string | null;
}

export function LiffInitStatus({ isInitialized, error }: LiffInitStatusProps) {
  if (!isInitialized) {
    return <p className="text-[#00B900] mb-4">初始化 LIFF 中...</p>;
  }

  if (error) {
    return (
      <div className="mb-4 w-full rounded border border-red-200 bg-red-50/50 p-4">
        <p className="font-medium text-red-500">LIFF 初始化失敗</p>
        <p className="mt-2 text-sm text-red-400">
          <code>{error}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 w-full rounded border border-[#00B900]/20 bg-[#00B900]/5 p-4">
      <p className="font-medium text-[#00B900]">LIFF 初始化成功</p>
    </div>
  );
}
