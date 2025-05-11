'use client'; // Navigation often involves client-side interactions

// import Link from 'next/link'; // Example if using Next.js Link for navigation

/**
 * A global bottom navigation bar component.
 * Placeholder implementation.
 */
export function GlobalBottomNav() {
  // Example: Check LIFF status or user auth from context if needed
  // const { isLoggedIn } = useLiffContext(); // Assuming useLiffContext is accessible

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-gray-100 p-4 shadow-md">
      <ul className="flex justify-around">
        <li>
          {/* Example Link */}
          {/* <Link href="/">Home</Link> */}
          <button onClick={() => alert('Home clicked!')}>Home</button>
        </li>
        <li>
          <button onClick={() => alert('Profile clicked!')}>Profile</button>
        </li>
        <li>
          <button onClick={() => alert('Settings clicked!')}>Settings</button>
        </li>
      </ul>
    </nav>
  );
}

// Note: You would typically import and place <GlobalBottomNav /> within your layout
// (e.g., inside GlobalProviders in layout.tsx or a specific page layout)
// Ensure your main content area has appropriate padding-bottom to avoid overlap.
