import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  distance?: 'sm' | 'md' | 'lg';
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  threshold = 0.05,
  delay = 0,
  distance = 'md',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = domRef.current;
    if (!current) return;

    if (once && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [threshold, once, isVisible]);

  const distanceClasses = {
    sm: 'translate-y-8',
    md: 'translate-y-14 sm:translate-y-16',
    lg: 'translate-y-20 sm:translate-y-24',
  }[distance];

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '850ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : `opacity-0 ${distanceClasses} will-change-transform`
      } ${className}`}
    >
      {children}
    </div>
  );
};

