'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Whiteboard from '@/components/Whiteboard';

export default function WhiteboardCanvasPage() {
  return (
    <div className="fixed inset-0 bg-black z-[9999]">
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center text-white">Loading Canvas...</div>}>
        <CanvasWrapper />
      </Suspense>
    </div>
  );
}

function CanvasWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  // Fetch user data from localStorage for the SDK component
  const userId = "local_user"; // In production, get from user profile state
  
  return (
    <Whiteboard whiteboardId={id} />
  );
}
