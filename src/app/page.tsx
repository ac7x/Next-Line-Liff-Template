'use client';

import { LineBotIntegration } from '@/interfaces/lineBot/components/LineBotIntegration';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <div className="mt-6">
        <LineBotIntegration />
      </div>
    </div>
  );
}
