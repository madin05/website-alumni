import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { sendDemoHeartbeat } from '@/services/demoSessionService';
import { isDemoSession, getDemoUsername } from '@/data/demoUsers';

export const SessionTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, checkSessionExpiry, recordDashboardActivity } = useAuthStore();
  const lastThrottleRef = useRef<number>(0);

  // 1. Pantau interaksi nyata pengguna (click, touch, scroll, keydown, mousemove) untuk SEMUA akun yang sedang login
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const handleUserInteraction = () => {
      const now = Date.now();
      // Throttle update setiap 5 detik agar performa browser mobile/desktop tetap optimal
      if (now - lastThrottleRef.current > 5000) {
        lastThrottleRef.current = now;
        recordDashboardActivity();
      }
    };

    const events = ['mousedown', 'touchstart', 'scroll', 'keydown', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
    };
  }, [isAuthenticated, user, recordDashboardActivity]);

  // 2. Pantau setiap pergantian rute URL
  useEffect(() => {
    if (isAuthenticated) {
      checkSessionExpiry(location.pathname).then((expired) => {
        if (expired) {
          navigate('/login', {
            replace: true,
            state: {
              expiredMessage: 'Sesi otomatis berakhir karena tidak ada aktivitas selama 2 jam.',
            },
          });
        }
      });
    }
  }, [location.pathname, isAuthenticated, checkSessionExpiry, navigate]);

  // 3. Pemeriksaan periodik setiap 15 detik & saat tab browser kembali aktif (focus / visibilitychange)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const isDemo = isDemoSession(user);
    const demoUsername = isDemo ? getDemoUsername(user) : null;

    const checkAndTrigger = async () => {
      const expired = await checkSessionExpiry(window.location.pathname);
      if (expired) {
        navigate('/login', {
          replace: true,
          state: {
            expiredMessage: 'Sesi otomatis berakhir karena tidak ada aktivitas selama 2 jam.',
          },
        });
        return;
      }

      // Jika akun demo masih aktif (< 2 jam), kirim heartbeat keepalive di background
      if (isDemo && demoUsername) {
        sendDemoHeartbeat(demoUsername).catch(() => {});
      }
    };

    // Eksekusi pertama kali saat komponen aktif
    checkAndTrigger();

    const interval = setInterval(checkAndTrigger, 15000);

    const handleFocusOrVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        checkAndTrigger();
      }
    };

    window.addEventListener('visibilitychange', handleFocusOrVisible);
    window.addEventListener('focus', handleFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleFocusOrVisible);
      window.removeEventListener('focus', handleFocusOrVisible);
    };
  }, [isAuthenticated, user, checkSessionExpiry, navigate]);

  return null;
};
