'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const getHash = () =>
  typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.replace('#', '')) : undefined;

export const useHash = () => {
  const [hash, setHash] = useState(getHash());
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const handleHashChange = () => {
    setHash(getHash());
  };
  useEffect(() => {
    handleHashChange();
  }, [params]);

  useEffect(() => {
    setIsClient(true);
    window.onhashchange = handleHashChange;
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return isClient ? hash : null;
};

export default useHash;
