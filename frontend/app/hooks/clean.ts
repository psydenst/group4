// hooks/useCleanUrl.ts
'use client';

import { useEffect } from 'react';
import { cleanUrlParams } from '../utils/auth';

export const useCleanUrl = () => {
  useEffect(() => {
    // Limpa a URL imediatamente quando o componente monta
    const timer = setTimeout(() => {
      cleanUrlParams();
    }, 100);

    // Também limpa quando a página ganha foco (usuário volta para a aba)
    const handleFocus = () => {
      cleanUrlParams();
    };

    // Limpa quando há mudanças na URL
    const handlePopState = () => {
      cleanUrlParams();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};

// Hook mais avançado que também monitora mudanças na URL
export const useSecureUrl = () => {
  useEffect(() => {
    // Observer para mudanças na URL
    const observer = new MutationObserver(() => {
      cleanUrlParams();
    });

    // Monitora mudanças no documento que podem afetar a URL
    observer.observe(document, { 
      childList: true, 
      subtree: true 
    });

    // Limpa periodicamente (apenas como backup)
    const interval = setInterval(() => {
      cleanUrlParams();
    }, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
};
