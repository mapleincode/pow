import { Input, Button, Modal, InputNumber, DatePicker, Select, message } from 'antd';
import { PlusCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import co from 'co'

const { Option } = Select;
const { confirm } = Modal;

export default function CreateItem(props) {
  const handleCreateItem = props.handleCreateItem;
  const fetch = props.fetch;
  const repoItem = props.repoItem;
  const setRepoItem = props.setRepoItem;

  const defaultLabels = (props.defaultLabels || ['尿不湿', '洗浴用品', '调味品']).map(item => <Option key={item}>{item}</Option>);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // const data = {
    
  // }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  const handleName = (e) => {
    const name = e.target.value;
    // data.name = name;
    setRepoItem({ name })
  }

  const handleCount = (e) => {
    const count = e.target.value;
    // data.count = count;
    setRepoItem({ count });
  }

  const handleCountUnix = (countUnix) => {
    // const countUnix = e.target.value;
    // data.countUnix = countUnix;
    setRepoItem({ countUnix });
    
  }

  const handleDateType = dateType => {
    // const dateType = e.target.value;
    // data.dateType = dateType;
    setRepoItem({ dateType });
  }

  const handleDate = (date, dateString) => {
    // const date = e.target.date;
    // data.date = dateString;
    setRepoItem({ date: dateString });
  }

  const handleExpirationUnix = (expirationUnix) => {
    // const expirationUnix = e.target.value;
    // data.expirationTimeUnix = expirationUnix;
    setRepoItem({ expirationTimeUnix: expirationUnix });
  }

  const handleExpirationValue = (e) => {
    const expirationValue = e.target.value;
    // data.expirationTimeValue = expirationValue
    setRepoItem({ expirationTimeValue: expirationValue });
  }

  const handleBoughtDate = (date, dateString) => {
    // const boughtDate = e.target.value;
    // data.boughtDate = dateString;
    setRepoItem({ boughtDate: dateString });
  }

  const handleRemark = (e) => {
    const remark = e.target.value;
    setRepoItem({ remark });
  }
  const showPromiseConfirm = () => {
    const result = { ...repoItem}

    if (!result.name) {
      message.error('物品名称不能为空');
      return;
    }
    if (!result.date) {
      message.error('日期不能为空');
      return;
    }
    if (!result.expirationTimeValue) {
      result.expirationTimeValue = null;
      result.expirationTimeUnix = null;
    }

    if (result.dateType === 'production') {
      result.productionDate = result.date;

      if (!result.expirationTimeValue) {
        message.error('生产日期模式必须要选择保质期!');
        return;
      }
    } else {
      result.expirationDate = result.date;
    }

    delete result.dateType;
    delete result.date;

    for (const key of Object.keys(result)) {
      if (result[key] === null) {
        delete result[key];
      }
    }

    confirm({
      title: '确定新增？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        try {
          await co(handleCreateItem(result));
        } catch (err) {
          message.error(err.message);
          return;
        }
        await co(fetch());
        handleOk();
      },
      onCancel() { },
    });
  }

  const handleLabelChange = (value) => {
    setRepoItem({ labels: value });
  }


  return <div>
    <Button
      style={{ marginLeft: '0.3em' }}
      type="primary"
      icon={<PlusCircleFilled />}
      size="default"
      onClick={showModal}
    >
      新增
        </Button>
    <Modal title="新增" visible={isModalVisible} footer={null} onOk={handleOk} onCancel={handleCancel}>
      <Input placeholder="名称" onBlur={handleName} style={{ marginBottom: '0.5em' }} />
      <span style={{ marginRight: '2.5em' }}>数量:</span>
      <Select defaultValue="个" onSelect={handleCountUnix} style={{ marginRight: '4em', marginBottom: '0.5em' }}>
        <Option value="个">个</Option>
        <Option value="箱">箱</Option>
        <Option value="包">包</Option>
        <Option value="袋">袋</Option>
        <Option value="组">组</Option>
        <Option value="盒">盒</Option>
      </Select>
      <InputNumber onBlur={handleCount} min={1} max={1000000} defaultValue={1} style={{ marginBottom: '0.5em' }} />

      <br />
      <span style={{ marginRight: '2.5em' }}>日期:</span>
      <Select onSelect={handleDateType} defaultValue="production" style={{ marginRight: '1em' }}>
        <Option value="production">生产日期</Option>
        <Option value="expiration">过期日期</Option>
      </Select>
      <DatePicker onChange={handleDate} style={{ marginBottom: '0.5em' }} />
      <br />
      <span style={{ marginRight: '1.5em' }}>保质期:</span>
      <Select defaultValue="年" onSelect={handleExpirationUnix} style={{ marginRight: '4em', marginBottom: '0.5em' }}>
        <Option value="年">年</Option>
        <Option value="月">月</Option>
        <Option value="天">天</Option>
      </Select>

      <InputNumber onBlur={handleExpirationValue} min={1} max={100} defaultValue={null} style={{ marginBottom: '0.5em' }} />
      <br />
      <span style={{ marginRight: '0.5em' }}>购入日期:</span>
      <DatePicker onChange={handleBoughtDate} style={{ marginBottom: '0.5em' }} />
      <br />
      <Select mode="tags" style={{ width: '100%', marginBottom: '0.5em' }} placeholder="标签" onChange={handleLabelChange}>
        {defaultLabels}
      </Select>
      <br />
      <Input placeholder="备注" onBlur={handleRemark} style={{ marginBottom: '0.5em' }} />
      
      <Button
        type="primary"
        size="default"
        onClick={showPromiseConfirm}
      >
        确定
        </Button>
    </Modal>

  </div>
}