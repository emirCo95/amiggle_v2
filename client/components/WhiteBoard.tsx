'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

export default function Whiteboard() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  useEffect(() => {
    if (excalidrawAPI) {
      // Set initial zoom after the component has been mounted and API is ready
      excalidrawAPI.setZoom(1); // Use Excalidraw's API to set zoom level
    }
  }, [excalidrawAPI]);

  return (
    <div className="w-full h-[80vh] border">
      <Excalidraw
        initialData={{
          elements: [],
          appState: {
            viewBackgroundColor: '#f0f0f0',
            offsetLeft: 0,
            offsetTop: 0,
          },
        }}
        excalidrawAPI={(api) => setExcalidrawAPI(api)} // Excalidraw API reference
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: true,
            saveToActiveFile: true,
            export: false,
          },
        }}
      />
    </div>
  );
}
