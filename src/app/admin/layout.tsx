export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          {/* Admin-specific layout components can be added here */}
          {children}
        </div>
      </body>
    </html>
  );
}
