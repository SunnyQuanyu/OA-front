import { CalendarOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Divider, Form, Skeleton, Table, Typography, Button } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ThingSearchForm from '../../components/Thing/ThingSearchForm';
import http from '../../utils/axios';
import ThingFileShow from '../../components/Thing/ThingFileShow';
import BreadNav from '../../components/Frame/BreadNav';
import ThingAnswerResult from '../../components/Thing/ThingAnswerResult';

const { Title, Paragraph } = Typography;

const ThingCreated = ({ match, history, location }) => {
  const [form] = Form.useForm();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [thing, setThing] = useState({});
  const [thingFileList, setThingFileList] = useState([]);
  const [receiversCount, setReceiversCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [receivers, setReceivers] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getThingInfo(pageCurrent, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getThingInfo = (pageCurrent, pageSize, data) => {
    setLoading(true);
    http
      .post('/thing/created/get', {
        pageCurrent,
        pageSize,
        data: { ...data, thingId: match.params.id },
      })
      .then((res) => {
        if (res.data.code === 0) {
          const data = res.data.data;
          setThing(data.thing);
          setReceiversCount(data.receiversCount);
          setReadCount(data.readCount);
          setFinishedCount(data.finishedCount);
          setReceivers(data.thingReceiversPage.records);
          setThingFileList(data.files);
          setPageTotal(data.thingReceiversPage.total);
          setQuestions(data.questions);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const map01toNY = (text) => {
    return text === '1' ? '是' : <span style={{ color: 'red' }}>否</span>;
  };

  const commonColumns = [
    {
      title: '姓名',
      dataIndex: 'realName',
      render: (text, record) => {
        if (record.hasFinished === '1') {
          return (
            <Button
              style={{ padding: '0' }}
              type='link'
              onClick={() => {
                history.push(
                  `/thing/created/${match.params.id}/${record.userId}`
                );
              }}>
              {text}
            </Button>
          );
        }
        return text;
      },
    },
    {
      title: '是否阅读',
      dataIndex: 'hasRead',
      render: map01toNY,
    },
  ];

  const columns =
    thing.needFinish === '1'
      ? [
          ...commonColumns,
          {
            title: '是否完成',
            dataIndex: 'hasFinished',
            render: map01toNY,
          },
        ]
      : commonColumns;

  const onFinish = (value) => {
    getThingInfo(1, 20, value);
  };

  return (
    <>
      <BreadNav
        navs={[
          { url: '/thing/createdlist', name: '已创建' },
          { url: location.pathname, name: thing.title },
        ]}
      />
      <Card style={{ height: '100%' }}>
        <Typography>
          <Title level={2}>{thing.title}</Title>
          <Skeleton
            loading={thing.title === null || thing.title === undefined}
          />
          <Paragraph>
            <div style={{ margin: '1rem 0' }}>
              <TagOutlined />
              <span style={{ margin: '0 30px 0 4px' }}>
                标签：{thing.tagName}
              </span>
              <UserOutlined />
              <span style={{ margin: '0 30px 0 4px' }}>
                发起人：{thing.realName}
              </span>
              <CalendarOutlined />
              <span style={{ margin: '0 30px 0 4px' }}>
                事务发布时间：
                {moment(thing.createTime).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
            <div style={{ margin: '1rem 0' }}>
              <span style={{ margin: '0 2rem 0 0' }}>
                阅读：{`${readCount}/${receiversCount}`}
              </span>
              {thing.needFinish === '1' && (
                <span>完成：{`${finishedCount}/${receiversCount}`}</span>
              )}
            </div>
            <ul>
              {thing.startTime !== null && (
                <li>
                  事务开始时间：
                  {moment(thing.startTime).format('YYYY-MM-DD HH:mm')}
                </li>
              )}
              {thing.endTime !== null && (
                <li>
                  事务结束时间：
                  {moment(thing.endTime).format('YYYY-MM-DD HH:mm:ss')}
                </li>
              )}
              <li>
                是否需要完成：
                {thing.needFinish === '1' ? (
                  <span style={{ color: 'blue' }}>是</span>
                ) : (
                  '否'
                )}
              </li>
              {thing.needFinish === '1' && (
                <li>
                  是否需要回答：
                  {thing.needAnswer === '1' ? (
                    <span style={{ color: 'blue' }}>是</span>
                  ) : (
                    '否'
                  )}
                </li>
              )}
              {thing.needFinish === '1' && (
                <li>
                  是否需要回复文件：
                  {thing.needFileReply === '1' ? (
                    <span style={{ color: 'blue' }}>是</span>
                  ) : (
                    '否'
                  )}
                </li>
              )}
            </ul>
          </Paragraph>

          <Title level={4}>内容：</Title>
          <Skeleton
            loading={thing.content === null || thing.content === undefined}
          />
          <Paragraph>{thing.content}</Paragraph>
          {Array.isArray(thingFileList) && thingFileList.length > 0 && (
            <ThingFileShow files={thingFileList} />
          )}
          {questions !== null && (
            <>
              <Title level={4}>问答：</Title>
              <ThingAnswerResult questions={questions} />
            </>
          )}
        </Typography>
        <Divider />
        <Title level={4}>完成情况：</Title>
        <Card style={{ marginBottom: '1rem' }}>
          <ThingSearchForm
            form={form}
            onFinish={onFinish}
            needFinish={thing.needFinish === '1'}
          />
        </Card>
        <Table
          loading={loading}
          pagination={{
            current: pageCurrent,
            pageSize: pageSize,
            total: pageTotal,
            showTotal: (total, range) =>
              ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
            onChange: (page, pageSize) => {
              setPageCurrent(page);
              form.validateFields().then((values) => {
                getThingInfo(page, pageSize);
              });
            },
            onShowSizeChange: (page, size) => {
              setPageCurrent(1);
              setPageSize(size);
              form.validateFields().then((values) => {
                getThingInfo(1, size, values);
              });
            },
          }}
          columns={columns}
          dataSource={receivers}
          rowKey={(row) => row.id}
        />
      </Card>
    </>
  );
};

export default ThingCreated;
