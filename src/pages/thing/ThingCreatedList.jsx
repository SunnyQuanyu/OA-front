import { Button, Card, Table, Form, Row, Col, Input, TreeSelect, Select, DatePicker, Popconfirm, message} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import http from '../../utils/axios';
import BreadNav from '../../components/Frame/BreadNav';
const { Option } = Select;

 const ThingCreatedList = ({ history }) => {

  const [form] = Form.useForm();

  const [pageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [tags, setTags] = useState([]);
  const [dataSave, setDataSave] = useState({});


  useEffect(() => {
    getCreatedThings(pageCurrent, pageSize, dataSave);
    getAvalibleTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAvalibleTags = () => {
    http
      .post('/tag/tags')
      .then((res) => {
        if (res.data.code === 0) {
          setTags(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };





 const handleDelete = id => {
  http
      .post('/thing/deleteThing',{
       id : id,
      })
      .then((res) => {
        console.log(res);
        if (res.data.data === 1) {
          setPageCurrent(1)
          getCreatedThings(pageCurrent,pageSize,dataSave);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  
 
};


  const formatDate = (date) => {
    if (date === null) {
      return '无';
    }
    return moment(date).format('YYYY-MM-DD HH:mm');
  };

  const map01toNY = (text) => {
    return text === '1' ? <span style={{ color: 'blue' }}>是</span> : '否';
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
          onClick={() => history.push(`/thing/created/${record.id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tagName',
    },
    {
      title: '阅读',
      dataIndex: 'hasRead',
      render: (text, record) => {
        let style = {};
        if (record.readCount === record.receiversCount) {
          style = { color: 'green' };
        }
        return (
          <span style={style}>
            {`${record.readCount}/${record.receiversCount}`}
          </span>
        );
      },
    },
    {
      title: '完成',
      dataIndex: 'hasFinished',
      render: (text, record) => {
        let style = {};
        if (record.readCount === record.receiversCount) {
          style = { color: 'green' };
        }
        return (
          <span style={style}>
            {`${record.finishedCount}/${record.receiversCount}`}
          </span>
        );
      },
    },

    {
      title: '回执',
      dataIndex: 'needFinish',
      render: (text) => {
        return text === '1' ? <span style={{ color: 'blue' }}>有</span> : '无';
      },
    },

    {
      title: '回答',
      dataIndex: 'needAnswer',
      render: (text) => {
        return text === '1' ? (
          <span style={{ color: 'blue' }}>有</span>
        ) : (
          '无'
        );
      },
    },
    {
      title: '附件',
      dataIndex: 'needFileReply',
      render: (text) => {
        return text === '1' ? <span style={{ color: 'blue' }}>有</span> : '无';
      },
    },
    {
      title: '回复附件',
      dataIndex: 'needFileReply',
      render: map01toNY,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: formatDate,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: formatDate,
    },
    {
      title: '操作',
      dataIndex: 'deleteThing',
      render: (text,record)=> {
      return   (  <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(record.id)}>
         <a>删除</a>
        </Popconfirm>)
      },
    },
  ];

  const getCreatedThings = (current, size, data) => {
    setLoading(true);
    http
      .post('/thing/createdList1', {
        pageCurrent: current,
        pageSize: size,
        data: data,
      })
      .then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          setPageTotal(res.data.data.total);
          setDataSource(res.data.data.records);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };




  const config = {
    rules: [
      {
        type: 'object',
      //  required: true,
        message: 'Please select time!',
      },
    ],
  };


  const onFinish = value => {
    
    if(value.needAnswer == 0 && value.needFinish == 0 && value.needFileReply == 0){
      value.isFinished = null;
    //  alert("无需回答、回执和回复附件时，完成情况的选择作废哦！")
    message.warning("无需回答、回执和回复附件时，完成情况的选择作废哦！")
    }
    setPageCurrent(1);
    setPageSize(10);
    console.log(value)
  setDataSave(value);
  getCreatedThings(1, 10, value);
  };
 




  return (
    <>
      <BreadNav navs={[{ url: '/thing/joinedlist', name: '已创建' }]} />

      <Card>
        <Form
          form={form}
          name='advanced_search'
          
          className='ant-advanced-search-form'
          onFinish = {onFinish}
          >
          <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="title" label="事务标题">
                    <Input 
                    placeholder="事务标题" 
                    />
                  </Form.Item>
                  </Col>
                  <Col span={15}>
                  <Form.Item name="tagId" label="事务标签">
                        <TreeSelect
                            
                            showSearch
                            style={{ width: '100%' }}
                           
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择事务标签"
                            allowClear
                         
                            treeDefaultExpandAll
                            treeData={tags}
                                                    
                          >                      
                        </TreeSelect>                  
                  </Form.Item>
               
                </Col>
                </Row>
                <Row gutter={5}>
                <Col span={4}>
                 <Form.Item name="isRead" label="阅读情况">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                                                
                          >
                            <Option value="2">全部阅读</Option>
                            <Option value="1">部分阅读</Option>
                            <Option value="0">未阅读</Option>
                        </Select>
                 </Form.Item>
                </Col>
                <Col span={4}>
                 <Form.Item name="isFinished" label="完成情况">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                          
                          >
                            <Option value="2">全部完成</Option>
                            <Option value="1">部分完成</Option>
                            <Option value="0">未完成</Option>
                        </Select>
                 </Form.Item>
                 </Col>
                 <Col span={4}>
                 <Form.Item name="needAnswer" label="问答情况">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                            
                          >
                            <Option value="1">有</Option>
                            <Option value="0">无</Option>
                        </Select>
                 </Form.Item>
                 </Col>

                 <Col span={4}>
                 <Form.Item name="needFinish" label="回执情况">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                            
                          >
                            <Option value="1">有</Option>
                            <Option value="0">无</Option>
                        </Select>
                 </Form.Item>
                 </Col>

                <Col span={4}>
                <Form.Item name="hasSendFile" label="附件下载">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                          
                          >
                            <Option value="1">有</Option>
                            <Option value="0">无</Option>
                        </Select>
                        
                 </Form.Item>
                 </Col>
                 <Col span={4}>
                 <Form.Item name="needFileReply" label="回复附件">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                          
                          >
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                 </Form.Item>
                 </Col>
    
          </Row>
          <Row gutter={24}>
          <Col span={8}>
                 <Form.Item name="startTime" label="开始时间" {...config}>
                    <DatePicker 
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                    format="YYYY-MM-DD" 
                  
                    />
                 </Form.Item>
                 </Col>
                 <Col span={8}>
                 <Form.Item name="endTime" label="结束时间" {...config}>
                    <DatePicker 
                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }} 
                    format="YYYY-MM-DD" />
                 </Form.Item>
                 </Col>
          </Row>
          <Row>
          <Form.Item>
            <Col
              span={24}
              style={{
                textAlign: 'right'
              }}>
              <Button 
                type='primary' 
                htmlType='submit'
                
                >
                查询
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  form.resetFields();
               setDataSave({});
            
                }}>
                重置
              </Button>
            </Col>
            </Form.Item>
          </Row>
        </Form>
      </Card>
     
      <Card>
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
              getCreatedThings(page, pageSize,dataSave);
            },
            onShowSizeChange: (page, size) => {
              setPageCurrent(1);
              setPageSize(size);
              getCreatedThings(1, size,dataSave);
            },
          }}
          columns={columns}
          dataSource={dataSource}
          rowKey={(row) => row.id}
        />
      </Card>
     
    </>
     
  );
};


export default ThingCreatedList;