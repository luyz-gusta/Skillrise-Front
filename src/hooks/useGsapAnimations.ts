import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useStaggerAnimation = (dependency: any[] = []) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.children;
    
    gsap.fromTo(
      children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, dependency);

  return containerRef;
};

export const useFadeIn = (dependency: any[] = []) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, dependency);

  return ref;
};

export const useScaleIn = (dependency: any[] = []) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, dependency);

  return ref;
};
