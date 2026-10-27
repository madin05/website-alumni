import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, DEMO_INACTIVITY_TIMEOUT_MS } from '../../store/authStore';
import { sendDemoHeartbeat } from '@/services/demoSessionService';
import { isDemoSession, getDemoUsername } from '@/data/demoUsers';

const DEMO_ACTIVITY_STORAGE_KEY = 'alumni_demo_last_activity';

export const SessionTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, checkSessionExpiry, recordDashboardActivity, logout } = useAuthStore();
  const lastThrottleRef = useRef<number>(0);

  // 1. Pantau interaksi nyata pengguna (click, touch, scroll, keydown, mousemove) untuk akun demo
  useEffect(() => {
    if (!isAuthenticated || !user || !isDemoSession(user)) return;

    // Inisialisasi timestamp aktivitas jika belum ada
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(DEMO_ACTIVITY_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(DEMO_ACTIVITY_STORAGE_KEY, String(Date.now()));
      }
    }

    const handleUserInteraction = () => {
      const now = Date.now();
      // Throttle update localStorage setiap 5 detik agar performa browser mobile tetap mulus
      if (now - lastThrottleRef.current > 5000) {
        lastThrottleRef.current = now;
        try {
          localStorage.setItem(DEMO_ACTIVITY_STORAGE_KEY, String(now));
        } catch {
          // ignore
        }
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
  }, [isAuthenticated, user]);

  // 2. Pantau setiap pergantian rute URL
  useEffect(() => {
    if (isAuthenticated) {
      if (location.pathname.startsWith('/dashboard')) {
        recordDashboardActivity();
      } else {
        checkSessionExpiry(location.pathname);
      }
    }
  }, [location.pathname, isAuthenticated, recordDashboardActivity, checkSessionExpiry]);

  // 3. Pemeriksaan periodik setiap 25 detik & saat tab browser kembali aktif
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const isDemo = isDemoSession(user);
    const demoUsername = isDemo ? getDemoUsername(user) : null;

    const checkAndTrigger = async () => {
      const now = Date.now();

      // Cek inaktivitas akun demo (2 Jam)
      if (isDemo && demoUsername) {
        const lastActivityStr =
          typeof window !== 'undefined'
            ? localStorage.getItem(DEMO_ACTIVITY_STORAGE_KEY)
            : null;
        const lastActivity = lastActivityStr ? Number(lastActivityStr) : now;

        if (now - lastActivity >= DEMO_INACTIVITY_TIMEOUT_MS) {
          console.info('[SessionTracker] Sesi demo berakhir setelah tidak aktif 2 jam.');
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem(DEMO_ACTIVITY_STORAGE_KEY);
            } catch {
              // ignore
            }
          }
          await logout();
          navigate('/login', {
            replace: true,
            state: {
              expiredMessage:
                'Sesi akun demo otomatis berakhir karena tidak ada aktivitas selama 2 jam.',
            },
          });
          return;
        }

        // Jika masih aktif (< 2 jam), kirim sinyal heartbeat keepalive di background
        sendDemoHeartbeat(demoUsername).catch(() => {});
      }

      // Jalankan pemeriksaan sesi reguler
      const expired = await checkSessionExpiry(window.location.pathname);
      if (expired) {
        navigate('/login', { replace: true });
      }
    };

    // Eksekusi pertama kali saat komponen aktif
    checkAndTrigger();

    const interval = setInterval(checkAndTrigger, 25000);

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
  }, [isAuthenticated, user, checkSessionExpiry, logout, navigate]);

  return null;
};
