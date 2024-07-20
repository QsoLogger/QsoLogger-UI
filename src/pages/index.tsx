'use client';

import React, { useContext } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import dayjs from 'dayjs';
import { Col, Row, Spin, Statistic, Tooltip } from 'antd';
import Link from 'next/link';

import { MobxContext } from '@/src/pages/_app';
import { __ } from '../utils/i18n';
const Index: React.FC = () => {
  const statisticsApiUrl = '/api/v1/statistics';
  const statisticsApi = useSWR(
    statisticsApiUrl,
    async (u) =>
      axios
        .get(u, { params: {} })
        .then((r: any) => r.data)
        .catch(() => ({})),
    { refreshInterval: 60000 }
  );
  const { data, isLoading } = statisticsApi;
  const { store } = useContext(MobxContext) as any;
  return (
    <Spin spinning={isLoading}>
      <Row>
       
      </Row>
    </Spin>
  );
};

export default Index;
