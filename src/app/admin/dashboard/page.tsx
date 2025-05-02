export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">儀表板</h1>
      <p className="mt-4">歡迎來到後台儀表板！這裡是系統的概覽。</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-4 shadow">
          <h2 className="text-lg font-semibold">用戶數量</h2>
          <p className="mt-2 text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 shadow">
          <h2 className="text-lg font-semibold">今日訂單</h2>
          <p className="mt-2 text-3xl font-bold">567</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 shadow">
          <h2 className="text-lg font-semibold">系統通知</h2>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
}
