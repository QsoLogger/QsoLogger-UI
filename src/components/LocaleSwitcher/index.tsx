import React, { useContext, useEffect } from 'react';
import { MobxContext } from '@/src/pages/_app';
import { Select } from 'antd';
import { __, locales } from '@/src/utils/i18n';
import { Locale } from '@/src/types';

const LocaleSwitcher = () => {
  const { store } = useContext(MobxContext) as any;

  return (
    <div>
      <Select
        style={{ width: 200 }}
        placeholder={__('Language')}
        value={store.locale}
        options={Object.entries(locales).map(([key, value]) => ({
          label: value.LocaleName,
          value: key,
        }))}
        onChange={(v) => {
          store.setLocale(v as Locale);
        }}
      />
    </div>
  );
};

export default LocaleSwitcher;
