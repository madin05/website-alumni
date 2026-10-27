import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { sendDemoHeartbeat } from '@/services/demoSessionService';

export const SessionTracker: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, checkSessionExpiry, recordDashboardActivity } = useAuthStore();

  // 1. Pantau setiap pergantian rute URL
  useEffect(() => {
    if (isAuthenticated) {
      if (location.pathname.startsWith('/dashboard')) {
        recordDashboardActivity();
      } else {
        checkSessionExpiry(location.pathname);
      }
    }
  }, [location.pathname, isAuthenticated, recordDashboardActivity, checkSessionExpiry]);

  // 2. Pemeriksaan periodik setiap 30 detik & saat tab browser kembali aktif
  useEffect(() => {
    if (!isAuthenticated) return;

    const triggerHeartbeat = () => {
      if (user) {
        const cleanName = (user.nama || '').trim();
        const ident = (user.nisn || '').trim();
        if (
          /^user\s*\d+/i.test(cleanName) ||
          user.email?.includes('@demo.') ||
          ident.startsWith('30700100')
        ) {
          const match = cleanName.match(/\d+/);
          const username = match ? `user${match[0].padStart(2, '0')}` : cleanName;
          sendDemoHeartbeat(username);
        }
      }
    };

    // Kirim heartbeat pertama kali saat komponen aktif
    triggerHeartbeat();

    const interval = setInterval(() => {
      checkSessionExpiry(window.location.pathname);
      triggerHeartbeat();
    }, 25000);

    const handleFocusOrVisible = () => {
      checkSessionExpiry(window.location.pathname);
      triggerHeartbeat();
    };

    window.addEventListener('visibilitychange', handleFocusOrVisible);
    window.addEventListener('focus', handleFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleFocusOrVisible);
      window.removeEventListener('focus', handleFocusOrVisible);
    };
  }, [isAuthenticated, user, checkSessionExpiry]);

  return null;
};
