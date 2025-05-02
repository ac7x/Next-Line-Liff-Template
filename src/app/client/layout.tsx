export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="client-layout">
          {/* Client-specific layout components can be added here */}
          {children}
        </div>
      </body>
    </html>
  );
}
