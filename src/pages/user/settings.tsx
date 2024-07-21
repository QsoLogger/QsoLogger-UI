import { __ } from '@/src/utils/i18n';
import { Button, Form, Input } from 'antd';
import React from 'react';

const Settings = () => {
  return (
    <div>
      <h2>{__('Settings')}</h2>
      <Form>
        <Form.Item name="rname" label="用户名">
          <Input />
        </Form.Item>
        <Form.Item name="callsign" label="呼号">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="邮件">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input type="password" />
        </Form.Item>
        <Form.Item name="confirmPassword" label="确认密码">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings;
