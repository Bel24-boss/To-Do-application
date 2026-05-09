import type { ReactNode } from 'react';

interface NoticeProps {
  tone?: 'error' | 'success' | 'neutral';
  children: ReactNode;
}

export default function Notice({ tone = 'neutral', children }: NoticeProps) {
  return (
    <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
