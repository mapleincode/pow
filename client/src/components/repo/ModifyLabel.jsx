import { Input, Button, Modal, message, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import co from 'co';

const { Option } = Select;
const { confirm } = Modal;

export default function CreateItem(props) {
  const showText = props.showText || '修改';
  const placeholder = props.placeholder || '';
  const handleModify = props.handleModify;
  const key = props.keyname;
  const id = props.id;
  const defaultLabels = (props.defaultLabels || ['尿不湿', '洗浴用品', '调味品']).map(item => <Option key={item}>{item}</Option>);


  // let value = props.value;

  const [isModalVisible, setIsModalVisible] = useState(false);
  let [modifyValue, setModifyValue] = useState(props.value);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangeValue = (value) => {
    setModifyValue(value);
  }

  // const handleModifyValue = e => {
  //   value = e.target.value;
  // };

  const showPromiseConfirm = () => {
    confirm({
      title: '确定修改? ',
      icon: <ExclamationCircleOutlined />,
      // content: <p>{showText + ': ' + modifyValue}</p>,
      async onOk() {
        await co(handleModify({ [key]: modifyValue, id }))
        // await new Promise(resolve => setTimeout(resolve, 1000));
        message.info(`${showText}成功`);
        handleOk();
      },
      onCancel() {},
    });
  };

  

  return (
    <div style={{ display: 'inline-block' }}>
      <Button  onClick={showModal} style={{ marginLeft: '0.3em' }} type="default" size="default">
        {showText}
      </Button>
      <Modal
        title={showText}
        visible={isModalVisible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select value={modifyValue} mode="tags" style={{ width: '100%', marginBottom: '0.5em' }} placeholder="标签" onChange={handleChangeValue}>
        {defaultLabels}
      </Select>
      <Button type="primary" size="default" onClick={showPromiseConfirm}>
          确定
        </Button>
      </Modal>
    </div>
  );
}
