import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface FadeupProps {
  uid: string;
  delay?: number;
  children: ReactNode;
}

export default function Fadeup({ uid, delay = 0, children }: FadeupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 120,
      opacity: 0,
      delay,
      duration: 0.6,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`fadeup-${uid}`}>
      {children}
    </div>
  );
}
