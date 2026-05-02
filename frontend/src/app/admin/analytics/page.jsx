'use client';
import React from 'react';
import { IconShield } from '@tabler/icons-react';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center py-40 border border-white/5 bg-white/5 rounded-[4rem] text-slate-500 shadow-2xl'>
      <IconShield size={64} className='mb-6 text-indigo-500' />
      <h1 className='text-3xl font-black text-white mb-2'>Administrative Secure Zone</h1>
      <p className='font-bold uppercase tracking-widest text-[10px] text-indigo-400'>Accessing analytics module...</p>
    </div>
  );
}
