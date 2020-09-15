import React, { useEffect, useState } from 'react';
import { Tag, Card, Table, Button, Modal, Space, Input, Form, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import http from '../../utils/axios';
const { Option } = Select;

const TeamJoinedList = props => {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSave, setDataSave] = useState({});
  const [pageTotal, setPageTotal] = useState(0);


  const getJoinedTeams = (current, size, data) => {
    setLoading(true);
    http
      .post('/team/joinedList1', {
        pageCurrent: current,
        pageSize: size,
        data: data,
      })
      .then(res => {
        console.log(res.data);
        if (res.data.code === 0) {
          setTeams(res.data.data);
          console.log(res.data.data);
          setPageTotal(res.data.data.total);
          setLoading(false);
        }
      }
      )
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getJoinedTeams(pageCurrent, pageSize, dataSave);
  }, []);

  const onFinish = value => {
    
    setPageCurrent(1);
    setPageSize(10);
    console.log(value)
  setDataSave(value);
  getJoinedTeams(1, 10, value);

  };


  const columns = [
    { title: '小组', 
    dataIndex: 'teamName',
    render: (text, record) => (
      <Button
        type='link'
        style={{ padding: '0', margin: '0' }}
        onClick={() => props.history.push(`/team/joined/${record.id}`)}>
        {text}
      </Button>
    ),
    },
    {
      title: '是否私有',
      dataIndex: 'publicState',
      render: text => (
        <span style={text !== 0 ? { color: 'blue' } : {}}>
          {text === 0 ? '是' : '否'}
        </span>
      )
    },
    { title: '创建人', 
    dataIndex: 'realName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
  ];

  return (

<div>
<Card>
        <Form
          form={form}
          name='advanced_search'
          
          className='ant-advanced-search-form'
          onFinish = {onFinish}
          >
          <Row gutter={24}>
          <Space size = "large">
                
                  <Form.Item name="teamName" label="组名">
                    <Input 
                    placeholder="小组名字" 
                    />
                  </Form.Item>
                
                 <Form.Item name="publicState" label="是否私有">
                  <Select
                            style={{
                              width: 80,
                              margin: '0 8px',
                            }}
                          
                          >
                            <Option value="0">是</Option>
                            <Option value="1">否</Option>
                        </Select>
                 </Form.Item>
                
                 <Form.Item name="createTime" label="创建时间" >
                    <DatePicker 
                  //  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                  defaultValue={ moment('00:00:00', 'HH:mm:ss') }
                    format="YYYY-MM-DD" 
                  
                    />
                 </Form.Item>
                 
                 </Space>
          </Row>
          <Row>
          <Form.Item>
            <Col
              span={24}
              style={{
                textAlign: 'right'
              }}>
              <Button 
              //  type='primary' 
                htmlType='submit'
                
                >
                查询
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  form.resetFields();
              // setDataSave({});
            
                }}>
                重置
              </Button>
            </Col>
            </Form.Item>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={teams}
        rowKey={record => record.id}
      />
</div>

  );
};

export default TeamJoinedList;
