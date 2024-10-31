import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/LoadingAnimation.json';

const PageLoadAnimation = () => {
  const animationContainer = useRef(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchMedia.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchMedia.addEventListener('change', handleChange);

    const animationInstance = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData,
    });

    animationInstance.addEventListener('complete', () => {
      setAnimationComplete(true);
    });

    return () => {
      animationInstance.removeEventListener('complete', () => {
        setAnimationComplete(true);
      });
      matchMedia.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        opacity: animationComplete ? 0 : 1,
        zIndex: animationComplete ? -1 : 9999,
        transition: 'opacity 1.5s, z-index 1.5s',
      }}
    >
      {!animationComplete && (
        <div
          ref={animationContainer}
          style={{
            ...styles.animation,
            filter: isDarkMode ? 'invert(1)' : 'none',
          }}
        ></div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
};

export default PageLoadAnimation;