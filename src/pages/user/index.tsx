import { UserItem } from '@src/types';
import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Switch, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import useSWR from 'swr';
import { __ } from '@/src/utils/i18n';
import { MobxContext } from '@/src/pages/_app';

const User = () => {
  useContext(MobxContext) as any;
  const userApiUrl = '/api/v1/user';
  const { mutate, data } = useSWR(userApiUrl, async (u) =>
    axios.get(u).then((r) => r.data)
  );
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserItem>(null);
  const [form] = Form.useForm();
  const columns = [
    {
      title: __('ID'),
      dataIndex: 'id',
    },
    {
      title: __('Username'),
      dataIndex: 'username',
    },
    {
      title: __('Name'),
      dataIndex: 'name',
    },
    {
      title: __('Callsign'),
      dataIndex: 'callsign',
    },
    {
      title: __('Email'),
      dataIndex: 'email',
    },
    {
      title: __('IP'),
      dataIndex: 'userIp',
    },
    {
      title: __('Login At'),
      dataIndex: 'loginAt',
    },
    {
      title: __('Status'),
      dataIndex: 'status',
      render: (status: number, row: any) => (
        <Switch
          checkedChildren={__('Enable')}
          unCheckedChildren={__('Disable')}
          checked={status > 0}
          onChange={async (s: boolean) => {
            await axios
              .post(`${userApiUrl}/${row?.id}`, { status: s ? 1 : 0 })
              .then(mutate);
          }}
        />
      ),
    },
    {
      title: __('Operation'),
      width: '100px',
      render: (row: UserItem) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentUser(row);
            setUserModalOpen(true);
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    form?.setFieldsValue(currentUser);
  }, [currentUser, form]);
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setUserModalOpen(true);
        }}
      >
        {__('New')}
      </Button>
      <Table columns={columns} rowKey="id" dataSource={data?.rows} />
      <Modal
        title="新增/修改用户"
        open={userModalOpen}
        onCancel={() => {
          setUserModalOpen(false);
        }}
        onOk={async () => {
          await form
            .validateFields()
            .then(async (values) => {
              await axios.post(userApiUrl, values);
            })
            .finally(() => {
              setUserModalOpen(false);
              mutate();
            });
        }}
      >
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={__('User')}
            rules={[
              { required: true, message: '请输入用户名' },
              {
                pattern: /^[0-9a-zA-Z]{1,16}$/,
                message: '用户名只能使用大小写字母和数字，长度1到16字符',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="callsign"
            label="呼号"
            rules={[
              { required: true, message: '请输入呼号' },
              {
                pattern: /^[0-9A-Z/]{1,16}$/,
                message: '呼号只能使用大写字母和数字以及/',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            hasFeedback
            rules={[
              {
                type: 'email',
                message: '请输入合法的Email',
              },
              {
                required: true,
                message: '请输入Email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="passwd"
            label="密码"
            rules={[
              {
                required: !currentUser?.id,
                message: '请输入密码',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: !currentUser?.id,
                message: '请确认密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('passwd') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('密码不匹配'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="status" label="用户状态">
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              checked={currentUser?.status === 1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
