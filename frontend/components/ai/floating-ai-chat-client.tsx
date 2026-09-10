'use client';

import dynamic from 'next/dynamic';

const FloatingAiChat = dynamic(
  () => import('@/components/ai/floating-ai-chat').then((mod) => mod.FloatingAiChat),
  { ssr: false }
);

export function FloatingAiChatClient() {
  return <FloatingAiChat />;
}
