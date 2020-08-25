/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Popconfirm, message, Modal } from 'antd';
import { userColomns } from '../../utils/table-columns';
import http from '../../utils/axios';
import UserSearchResult from '../../components/UserSearchResult';
import BreadNav from '../../components/Frame/BreadNav';

const TeamInfo = (props) => {
  const [loading, setLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [teamData, setTeamData] = useState({ membersPage: { total: 0 } });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addUserIDs, setAddUserIDs] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = () => {
    setLoading(true);
    http
      .post('/team', {
        pageCurrent: pageCurrent,
        pageSize: pageSize,
        data: {
          id: props.match.params.id,
        },
      })
      .then((res) => {
        if (res.data.code === 0) {
          setTeamData(res.data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelMembers = () => {
    let members = selectedRowKeys.map((key) => ({ id: key }));
    http
      .post('/team/delMember', {
        teamId: props.match.params.id,
        members,
      })
      .then((res) => {
        if (res.data.code === 0) {
          setSelectedRowKeys([]);
          getPageData();
          message.success('已删除！');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddMembers = () => {
    let members = addUserIDs.map((id) => ({ id }));
    http
      .post('/team/addMember', {
        teamId: props.match.params.id,
        members,
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.success('添加成功！');
          setSelectedRowKeys([]);
          getPageData();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setShowModal(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const pagination = {
    total: teamData.membersPage.total,
    current: pageCurrent,
    pageSize: pageSize,
    showTotal: (total, range) =>
      ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
    onChange: (page, pageSize) => {
      setPageCurrent(page);
      getPageData();
    },
    onShowSizeChange: (current, size) => {
      setPageCurrent(1);
      setPageSize(size);
      getPageData();
    },
  };

  return (
    <div>
      <BreadNav
        navs={[
          { url: '/team/createdlist', name: '已创建小组' },
          { url: props.location.pathname, name: `${teamData.teamName}成员：` },
        ]}
      />
      <Card
        loading={loading}
        title={`${teamData.teamName}成员：`}
        extra={
          <Button
            onClick={() => {
              setShowModal(true);
            }}
            type='primary'>
            添加成员
          </Button>
        }>
        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
          <Popconfirm
            title='谨慎：确定删除？'
            onConfirm={() => {
              handleDelMembers();
            }}>
            <Button
              disabled={selectedRowKeys.length === 0}
              danger={selectedRowKeys.length > 0}
              size='small'>{`删除已选择的${selectedRowKeys.length}项`}</Button>
          </Popconfirm>
          <Button
            disabled={selectedRowKeys.length === 0}
            type='link'
            size='small'
            onClick={() => {
              setSelectedRowKeys([]);
            }}>
            清除已选
          </Button>
        </div>
        <Table
          columns={userColomns}
          dataSource={teamData.membersPage.records}
          pagination={pagination}
          rowKey={(record) => record.id}
          rowSelection={rowSelection}
        />
      </Card>
      <Modal
        visible={showModal}
        width='80%'
        title='添加成员'
        onCancel={() => {
          setShowModal(false);
        }}
        onOk={handleAddMembers}>
        <UserSearchResult
          getSelectIds={(ids) => {
            setAddUserIDs(ids);
          }}
        />
      </Modal>
    </div>
  );
};

export default TeamInfo;
