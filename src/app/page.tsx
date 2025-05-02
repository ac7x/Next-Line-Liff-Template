'use client';

import { LiffContainer } from '@/interfaces/liff/components/LiffContainer';
import { LineBotIntegration } from '@/interfaces/lineBot/components/LineBotIntegration';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <LiffContainer />
      <div className="mt-6">
        <LineBotIntegration />
      </div>
    </div>
  );
}
