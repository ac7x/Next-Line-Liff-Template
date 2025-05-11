interface LiffInfoProps {
  isLoggedIn: boolean;
  os: string;
  language: string;
  isInClient: boolean;
  liffVersion: string;
  lineVersion: string;
}

export function LiffInfo({
  isLoggedIn,
  os,
  language,
  isInClient,
  liffVersion,
  lineVersion,
}: LiffInfoProps) {
  return (
    <div className="w-full rounded bg-gray-50 p-4 shadow">
      <h4 className="mb-2 text-lg font-bold">LIFF 資訊</h4>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="font-medium">登入狀態:</span>
          <span className={isLoggedIn ? 'text-green-500' : 'text-red-500'}>
            {isLoggedIn ? '已登入' : '未登入'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">作業系統:</span>
          <span>{os || '無法取得'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">語言:</span>
          <span>{language}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">LIFF 環境:</span>
          <span>{isInClient ? 'LINE App' : '外部瀏覽器'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">LIFF 版本:</span>
          <span>{liffVersion}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">LINE 版本:</span>
          <span>{lineVersion || '無法取得'}</span>
        </div>
      </div>
    </div>
  );
}
