import { Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import co from 'co';
const { confirm } = Modal;

export default function CreateItem(props) {
  const handleDelete = props.handleDelete;
  const id = props.id;
  const showPromiseConfirm = () => {

    confirm({
      title: '确定删除？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        await co(handleDelete({ id }));
        message.info('删除成功');
      },
      onCancel() { },
    });
  }

  return <Button onClick={showPromiseConfirm} style={{ marginLeft: '0.2em' }} type="danger" size="default">
  删除
</Button>
}