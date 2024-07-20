import { Button, ConfigProvider, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import useSWR from 'swr/mutation';
import { useRouter } from 'next/router';
import { __ } from '@utils/i18n';
import { MobxContext } from '@/src/pages/_app';
import { observer } from 'mobx-react-lite';

const LoginForm = () => {
  const { store } = useContext(MobxContext) as any;
  const loginUrl = '/api/v1/user/login';
  const registerUrl = '/api/v1/user/register';
  const router = useRouter();
  const [hideRegister, setHideRegister] = useState(true);
  const { trigger, isMutating } = useSWR(
    loginUrl,
    async (u: string, params: any) =>
      axios
        .post(u, params?.arg)
        .then((r) => {
          store.setCurrentUser(r.data);
          if (r.data) router.reload();
        })
        .catch((e) => {
          message.error(e.response.data?.message ?? e.message);
          return false;
        })
  );

  const [form] = Form.useForm();
  useEffect(() => {
    const showRegister = (e) => {
      if (e.key === '|') setHideRegister(false);
    };
    window.addEventListener('keydown', showRegister);
    return () => window.removeEventListener('keydown', showRegister);
  }, []);

  return (
    <ConfigProvider
      locale={{ locale: store.locale }}
      theme={{
        components: {
          Form: {
            labelColor: 'white',
          },
        },
      }}
    >
      <Form
        layout="inline"
        form={form}
        onFinish={() => {
          form.validateFields().then((values) => trigger(values));
        }}
      >
        <Form.Item
          name="name"
          label={__('User')}
          required
          rules={[
            {
              pattern: /^[0-9a-zA-Z]{1,16}$/,
              message: __(
                'Username must be 1 to 16 characters, including letters and numbers'
              ),
            },
          ]}
        >
          <Input placeholder={__('Username')} autoComplete="username" />
        </Form.Item>
        <Form.Item name="passwd" label={__('Password')} required>
          <Input.Password placeholder={__('Password')} autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isMutating}>
            {__('Login')}
          </Button>
        </Form.Item>
        <Form.Item hidden={hideRegister}>
          <Button
            type="default"
            onClick={() => {
              form.validateFields().then(async (data) => {
                await axios.post(registerUrl, data);
              });
            }}
          >
            {__('Register')}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default observer(LoginForm);
