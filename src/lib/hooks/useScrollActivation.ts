import { useState, useCallback, useEffect } from 'react';

export interface ActivationWatchOptions {
  activateThreshold: number;
  deactivateThreshold?: number;
  direction?: 'horizontal' | 'vertical';
}

const useScrollActivation = (
  container: React.RefObject<HTMLElement>,
  {
    activateThreshold = 0,
    deactivateThreshold = activateThreshold,
    direction = 'vertical',
  }: ActivationWatchOptions
) => {
  const [activated, setActivated] = useState(false);
  const watch = useCallback(() => {
    if (!container.current) {
      // default not activated when no scroll container
      setActivated(false);
      return;
    }
    const scrollValue =
      direction === 'horizontal'
        ? container.current.scrollLeft
        : container.current.scrollTop;
    if (scrollValue >= activateThreshold) {
      setActivated(true);
    } else if (scrollValue <= deactivateThreshold) {
      setActivated(false);
    }
  }, []);

  useEffect(() => {
    if (!container.current) return;
    container.current.addEventListener('scroll', watch, { passive: true });

    return () => {
      container.current.removeEventListener('scroll', watch);
    };
  }, [container.current]);

  return activated;
};

export default useScrollActivation;
