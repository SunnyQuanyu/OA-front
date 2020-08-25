/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Popconfirm, message, Modal, Form } from 'antd';
import { userColomns } from '../../utils/table-columns';
import http from '../../utils/axios';
import UserSearchResult from '../../components/UserSearchResult';
import BreadNav from '../../components/Frame/BreadNav';
import moment from 'moment';

const TeamJoined = (props) => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [teamData, setTeamData] = useState({ membersPage: { total: 0 } });
  const [dataSource, setDataSource] = useState([]);
  const [pageCurrent1, setPageCurrent1] = useState(1);
  const [pageSize1, setPageSize1] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  useEffect(() => {
    getPageData();
    getTeamThing();
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
  console.log(props.match.params.id);
  
  const getTeamThing = () => {
    setLoading(true);
    http
      .post('/thing/teamThing', {
        
          id: props.match.params.id,  
       
      })
      .then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          setDataSource(res.data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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


  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
      render: (text, record) => (
        <Button
          type='link'
          style={{ padding: '0', margin: '0' }}
          onClick={() => props.history.push(`/thing/thingDetail/${record.id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tagName',
    },
    {
      title: '发起人',
      dataIndex: 'realName',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => (
        <span>{text ? moment(text).format('YYYY-MM-DD') : '暂无'}</span>
      )
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => (
        <span>{text ? moment(text).format('YYYY-MM-DD') : '暂无'}</span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>,
    },


  ];


  return (
    <div>
      <BreadNav
        navs={[
          { url: '/team/joinedList', name: '我的小组' },
          { url: props.location.pathname, name: `${teamData.teamName}` },
        ]}
      />

      <Card
        loading={loading}
        title={`${teamData.teamName}事务：`}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          
        />
      </Card>

      <Card
        loading={loading}
        title={`${teamData.teamName}成员：`}
      >
        <Table
          columns={userColomns}
          dataSource={teamData.membersPage.records}
          pagination={pagination}
        />
      </Card>
    </div>
  );
};

export default TeamJoined;
