import { useState, useEffect } from 'react';
import { RouterContext } from './routerContext';
import { useRouter } from './useRouter';

/**
 * RouterProvider
 * Lightweight client-side router leveraging the standard HTML5 History API.
 * Requires zero external dependencies and supports direct URL loading,
 * browser back/forward buttons, hash anchor scrolling, and route state tracking.
 */
export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const scrollToHash = (hashStr) => {
      if (!hashStr) return;
      const id = hashStr.replace(/^#/, '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };

    // Scroll to section on initial cold load if hash exists
    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      if (window.location.hash) {
        scrollToHash(window.location.hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to, { replace = false, preserveScroll = false } = {}) => {
    if (!to) return;

    const [targetPath, hash] = to.split('#');
    const destinationPath = targetPath || '/';

    if (replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setCurrentPath(destinationPath);

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Link({ to, children, className = '', onClick, ...props }) {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
