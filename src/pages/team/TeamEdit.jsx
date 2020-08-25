import React, { useState } from 'react';
import { Input, Card, Radio, Button, Modal, message } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import UserSearchResult from '../../components/UserSearchResult';
import http from '../../utils/axios';

const TeamEdit = props => {
  const styleSpace = {
    margin: '1rem 0'
  };

  const [addUserIDs, setAddUserIDs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [publicState, setPublicState] = useState(0);

  const handleAddTeam = () => {
    http
      .post('/team/add', {
        teamName: teamName,
        publicState: publicState,
        memberIdList: addUserIDs
      })
      .then(res => {
        if (res.data.code === 0) {
          message.success('添加小组成功！');
          props.history.push('/team/createdlist');
          setShowModal(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <Modal
        title='请确认'
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        onOk={handleAddTeam}>
        <p>小组名：{teamName}</p>
        <p>{publicState === 0 ? '私有' : '共有'}</p>
        <p>一选择了{addUserIDs.length}人</p>
      </Modal>
      <Card
        title='创建小组'
        extra={
          <Button
            disabled={teamName === '' || teamName === null}
            type='danger'
            icon={<PlusSquareOutlined />}
            onClick={() => {
              setShowModal(true);
            }}>
            确定创建
          </Button>
        }>
        <Input
          addonBefore={<span>小组名：</span>}
          style={{ ...styleSpace, width: '50%' }}
          onChange={e => {
            setTeamName(e.target.value);
          }}
        />
        <Radio.Group
          defaultValue={publicState}
          style={styleSpace}
          onChange={e => {
            setPublicState(e.target.value);
          }}>
          <Radio value={0}>私有</Radio>
          <Radio value={1}>共有</Radio>
          <span style={{ color: 'green' }}>
            共有小组在创建事务时可被所有管理员选中，如不清楚，建使用私有小组。
          </span>
        </Radio.Group>
      </Card>
      <Card title='选择成员'>
        <UserSearchResult
          getSelectIds={ids => {
            setAddUserIDs(ids);
          }}
        />
      </Card>
    </div>
  );
};

export default TeamEdit;
