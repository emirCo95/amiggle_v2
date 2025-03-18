'use client';

import dynamic from 'next/dynamic';

// Since client components get prerenderd on server as well hence importing
// the excalidraw stuff dynamically with ssr false

const ExcalidrawWrapper = dynamic(
  async () => (await import('../components/ExaclidrawWrapper')).default,
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div className="w-full border overflow-auto">
      <ExcalidrawWrapper />
    </div>
  );
}
