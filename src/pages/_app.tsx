'use client';

import React, { ReactNode, createContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {
  LoadingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/dist/client/link';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';
import Debug from 'debug';
import {
  Avatar,
  Dropdown,
  Space,
  Spin,
  Menu,
  theme,
  Layout,
  ConfigProvider,
} from 'antd';
import { useStore } from '@src/stores';
import LoginForm from '@components/LoginForm';
import s from './style.module.less';
import Cookies from 'js-cookie';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useLocalState } from '../utils/cache';
import LocaleSwitcher from '../components/LocaleSwitcher';
import i18n, { __ } from '../utils/i18n';

dayjs.locale('zh-cn');

axios.defaults.headers['request-id'] = Cookies.get('uid');

const debug = Debug(`${__filename}:`);

const { Header, Content, Sider, Footer } = Layout;

export const MobxContext = createContext({});

const Frame = (props: { children: ReactNode }) => {
  const { children } = props;

  const store = useStore({ i18n });
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  // 后端逻辑中，user id 0 代表当前用户，返回当前会话对应的登录用户信息。
  const { data: user, isLoading: isLoadingUser } = useSWR(
    '/api/v1/user/0',
    async (u) =>
      axios.get(u).then((r) => {
        if (r.data) {
          store.setCurrentUser(r.data);
          return r.data;
        }
        return null;
      })
  );

  const logout = () => axios.get(`/api/v1/user/logout`).then(router.reload);

  const { data, isLoading: isLoadingVersion } = useSWR('/api/v1/version', (u) =>
    axios.get(u).then((r) => r.data)
  );

  const [buildId, setBuildId] = useState(null);
  const [collapsed, setCollapsed] = useLocalState('collapsed', true);
  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    setBuildId(window?.__NEXT_DATA__?.buildId);
  }, []);

  const isLoading = isLoadingUser || isLoadingVersion;
  const menuItems = [];
  if (user?.group === 1)
    menuItems.push({
      key: '/user/',
      icon: <UserOutlined />,
      label: <Link href="/user/">{__('User')}</Link>,
    });
  menuItems.push({
    key: '/logbook/',
    icon: <BookOutlined />,
    label: <Link href="/logbook/">{__('Logbook')}</Link>,
  });
  return isLoading ? (
    <Spin
      spinning
      className={s.loading}
      indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
    />
  ) : (
    <MobxContext.Provider value={{ store }}>
      <Layout className={s.container}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <div className={s.trigger} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? (
                <MenuUnfoldOutlined style={{ color: '#ccc' }} />
              ) : (
                <MenuFoldOutlined style={{ color: '#ccc' }} />
              )}
            </div>
          )}
          <Link href="/" className={s.link}>
            <div className={s.logo}>
              <Image
                alt="Logo"
                src="/icons/favicon.png"
                width={64}
                height={64}
              />
            </div>
          </Link>
          {/* <Menu theme='dark' mode='horizontal' items={items1} className={s.menu} selectable={false} /> */}
          <Space
            style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}
          >
            <LocaleSwitcher />
            {user ? (
              <Dropdown
                menu={{
                  items: [
                    // {
                    //   label: (
                    //     <Space onClick={() => router.push('/user/settings')}>
                    //       <SettingOutlined />
                    //       {__('Settings')}
                    //     </Space>
                    //   ),
                    //   key: 'settings',
                    // },
                    // {
                    //   type: 'divider',
                    // },
                    {
                      label: (
                        <Space onClick={logout}>
                          <LogoutOutlined />
                          {__('Logout')}
                        </Space>
                      ),
                      key: 'logout',
                    },
                  ],
                }}
              >
                <Avatar style={{ background: '#00d9ff' }} size={50}>
                  {user?.name?.substring(0, 2).toUpperCase()}
                </Avatar>
              </Dropdown>
            ) : (
              <LoginForm />
            )}
          </Space>
        </Header>
        {user && (
          <Layout>
            <Sider
              trigger={null}
              style={{
                background: colorBgContainer,
                maxWidth: 200,
                minWidth: 50,
              }}
              collapsible
              defaultCollapsed={collapsed}
              collapsed={collapsed}
              collapsedWidth={50}
            >
              <Menu
                className={s.menu}
                mode="inline"
                selectedKeys={[router.asPath]}
                items={menuItems}
              />
            </Sider>
            <Layout style={{ padding: 0 }}>
              <Content
                style={{
                  padding: 16,
                  margin: 0,
                  minHeight: 280,
                  background: colorBgContainer,
                }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        )}
        <Footer>
          <Space>
            {__('Copyright © 2024 QsoLogger')}
            <em>
              package version: {data?.package_name}_{data?.package_version};
              build version: {buildId}; api version: {data?.git_version}
            </em>
          </Space>
        </Footer>
      </Layout>
    </MobxContext.Provider>
  );
};

const App = (props: { Component: any; pageProps: any }) => {
  const { Component, pageProps } = props;
  return (
    <Frame>
      <ConfigProvider locale={locale}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Frame>
  );
};
export default App;
