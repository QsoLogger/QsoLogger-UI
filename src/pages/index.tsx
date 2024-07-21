'use client';

import React, { useContext } from 'react';
import { MobxContext } from '@/src/pages/_app';
import { __ } from '../utils/i18n';
const Index: React.FC = () => {
  useContext(MobxContext) as any;
  return <div>Home</div>;
};

export default Index;
