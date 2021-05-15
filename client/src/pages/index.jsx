import { Input, Button, Table, Tag, Descriptions } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'dva';
import CreateItem from '@/components/repo/CreateItem';
import DeleteItem from '@/components/repo/DeleteItem';
import ModifyItem from '@/components/repo/ModifyItem';
import ModifyLabel from '@/components/repo/ModifyLabel';
import { ReloadOutlined } from '@ant-design/icons'


const { Search } = Input;
const { Item } = Descriptions;



const columnsRender = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '8em',
    render: (data) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{data}</div>
  },
  {
    title: '数量',
    dataIndex: 'countText',
    key: 'count',
  },
  {
    title: '过期状态',
    dataIndex: 'isExpire',
    key: 'isExpire',
    render: type => {
      let name = '正常';
      let color = 'orange';
      if (type === 1) {
        color = 'green';
      } else if (type === 2) {
        color = 'red';
        name = '临期';
      } else if (type === 3) {
        color = 'black';
        name = '已过期';
      }
      return <Tag color={color}>{name}</Tag>;
    },
  }, {
    title: '距离过期',
    dataIndex: 'adventDateText',
    key: 'lackExpire'
  },
  {
    title: '保鲜度',
    dataIndex: 'freshDegree',
    key: 'bxd',
    render: item => {
      if (item === -1) {
        return <Tag color="red">-</Tag>;
      }

      item = parseInt(item);
      if (item > 100) item = 100;
      if (item <= 0) item = 1;

      return <span>{item + '%'}</span>;
    },
  },
];

function RepoList(props) {
  const {
    items = [],
    handleCreateItem,
    fetch,
    setRepoItem,
    repoItem,
    handleDelete,
    handleModify,
    keyword,
    handleKeywordChange,
    defaultLabels
  } = props;

  // table key
  items.forEach(item => {
    item.key = item.id.toString();
    item.countText = `${item.count} ${item.countUnix}`;
  });

  const expandedRowRender = data => {
    if (data.expirationTimeValue && data.expirationTimeUnix) {
      data.expirationTimeText = `${data.expirationTimeValue} ${data.expirationTimeUnix}`;
    }
    console.log(data);
    return (
      <div>
        <Descriptions column={2} bordered size="small">
          <Item span={2} label="距离过期还有">
            {data.adventDateText}
          </Item>
          <Item span={2} label="购入时间">
            {data.boughtDate ? moment.unix(data.boughtDate).format('YYYY年MM月DD日') : '-'}
          </Item>
          <Item span={2} label="生产时间">
            {data.productionDate ? moment.unix(data.productionDate).format('YYYY年MM月DD日') : '-'}
          </Item>
          <Item span={2} label="过期时间">
            {moment.unix(data.expirationDate).format('YYYY年MM月DD日')}
          </Item>
          <Item span={2} label="保质期">
            {data.expirationTimeText}
          </Item>
          <Item span={2} label="创建时间">
            {moment(data.createdAt).fromNow()}
          </Item>
          <Item span={2} label="备注">
            {data.remark}
          </Item>
        </Descriptions>

        {
          data.labels ?
            <div style={{ marginTop: '0.5em', marginLeft: '0.3em', marginBottom: '1em' }}>
              标签: {
                data.labels.map(label => <Tag
                  // closable={true}
                  onClose={(e) => {
                    e.preventDefault();
                  }} color={'blue'}>{label}</Tag>)}
                  <br/>
            </div>
            : ''}
        <div style={{ marginTop: '0.5em' }}>
          <ModifyItem id={data.id} handleModify={handleModify} keyname="name" showText="修改名称" placeholder={'名称'} value={data.name} />
          <ModifyItem id={data.id} handleModify={handleModify} keyname="count" showText="修改数量" placeholder={'数量'} value={data.count} />
        </div>
        <div style={{ marginTop: '0.5em' }}>
          <ModifyLabel id={data.id} handleModify={handleModify} keyname="labels" showText="修改标签" placeholder={'标签'} value={data.labels}/>
          <ModifyItem id={data.id} handleModify={handleModify} keyname="remark" showText="修改备注" placeholder={'备注'} value={data.remark} />
        </div>
        <div style={{ marginTop: '0.5em' }}>
          <DeleteItem id={data.id} handleDelete={handleDelete} />
        </div>
      </div>
    );
  };

  const createItemProps = {
    repoItem,
    setRepoItem,
    fetch,
    handleCreateItem,
    defaultLabels
  }

  const handleSearch = () => {
    fetch({ keyword });
  }

  const handleChangeSearch = (e) => {
    const keyword = e.target.value;
    handleKeywordChange(keyword);
    fetch({ keyword });
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          margin: '0.5em',
        }}
      >
        <Button
          icon={<ReloadOutlined />} onClick={fetch} style={{ marginRight: '0.4em' }}></Button>
        <Search value={keyword || ''} onPressEnter={handleSearch} onSearch={handleSearch} onChange={handleChangeSearch} on style={{ flex: 4 }} />
        <CreateItem {...createItemProps} style={{ flex: 1 }} />
      </div>

      <Table
        pagination={false}
        dataSource={items}
        columns={columnsRender}
        expandedRowRender={expandedRowRender}
        size="small"
      />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    items: state.repo.items,
    repoItem: state.repo.repoItem,
    keyword: state.repo.keyword,
    defaultLabels: state.repo.defaultLabels
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleCreateItem: async (data) => {
      await dispatch({
        type: 'repo/create',
        payload: data
      });
    },
    fetch: (params) => {
      dispatch({
        type: 'repo/fetch',
        payload: params
      });
    },
    clearList: () => {
      dispatch({
        type: 'repo/updateList',
        payload: []
      });
    },
    setRepoItem: (item) => {
      dispatch({
        type: 'repo/setRepoItem',
        payload: item
      })
    },
    handleDelete: (item) => {
      dispatch({
        type: 'repo/delete',
        payload: item
      })
    },

    handleModify: (item) => {
      dispatch({
        type: 'repo/modify',
        payload: item
      })
    },

    handleKeywordChange: (keyword) => {
      // const keyword = e.target.value;
      dispatch({
        type: 'repo/handleKeywordChange',
        payload: { keyword }
      });
    }

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoList);
