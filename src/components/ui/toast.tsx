'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: '!border-zinc-200 dark:!border-zinc-700 !bg-white dark:!bg-zinc-900 !text-zinc-900 dark:!text-zinc-100',
        duration: 3000,
      }}
    />
  );
}
