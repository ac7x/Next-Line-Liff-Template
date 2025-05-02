export default function StatsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">統計分析</h1>
      <p className="mt-4">這裡是統計分析頁面，展示系統的數據趨勢。</p>
      <div className="mt-6">
        <div className="rounded-lg bg-gray-50 p-4 shadow">
          <h2 className="text-lg font-semibold">範例圖表</h2>
          <div className="mt-4 flex h-64 items-center justify-center rounded-lg bg-gray-200">
            <span className="text-gray-500">圖表區域</span>
          </div>
        </div>
      </div>
    </div>
  );
}
