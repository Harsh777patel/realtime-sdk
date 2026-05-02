'use client';
import React from 'react';
import { IconRocket } from '@tabler/icons-react';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl text-zinc-500'>
      <IconRocket size={48} className='mb-4 text-indigo-500' />
      <h1 className='text-2xl font-bold text-white mb-2'>Under Construction</h1>
      <p>The integration module is coming soon.</p>
    </div>
  );
}
