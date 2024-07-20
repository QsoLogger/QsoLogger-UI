import React from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import UserStore from './User';
import { useLocalState } from '../utils/cache';
import { Locale } from '../types';

enableStaticRendering(typeof window === 'undefined');

let clientStore = null;

const initStore = (initData?: any) => {
  const store = clientStore ?? new UserStore(initData);
  if (typeof window === 'undefined') return store;
  if (!clientStore) clientStore = store;
  return store;
};

export function useStore(initData?: any) {
  const [defaultLocale, setDefaultLocale] = useLocalState<Locale>(
    'locale',
    'en_US'
  );
  return initStore({ ...initData, defaultLocale, setDefaultLocale });
}
