import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Space, Input, Popconfirm, Card, Form, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import http from '../../utils/axios';
const { Option } = Select;

const TeamCreatedList = props => {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});
  const [updateTeamName, setUpdateTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSave, setDataSave] = useState({});
  const [pageTotal, setPageTotal] = useState(0);

  const [saveTime, setSaveTime] = useState('');

  useEffect(() => {
    getCreatedTeams(pageCurrent, pageSize, dataSave);
  }, []);

  const getCreatedTeams = (current, size, data) => {
    setLoading(true);
    http
      .post('/team/createdList1', {
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
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onFinish = value => {
    
    setPageCurrent(1);
    setPageSize(10);
    console.log(value);
  //  value.createTime = saveTime;
    //console.log(value);
  setDataSave(value);
  getCreatedTeams(1, 10, value);
  };

  const handleOk = e => {
    http
      .post('/team/update', {
        id: updateRecord.id,
        teamName: updateTeamName
      })
      .then(res => {
        if (res.data.code === 0) {
          getCreatedTeams(pageCurrent, pageSize, dataSave);
        }
      })
      .catch(err => {
        console.log(err);
      });
    setShowUpdateModal(false);
  };

  const handleCancel = e => {
    setShowUpdateModal(false);
  };

  const handleDelete = id => {
    http
        .post('/team/del',{
         id : id,
        })
        .then((res) => {
          console.log(res);
          if (res.data.data === 1) {
            setPageCurrent(1);
            setDataSave(teams);
            getCreatedTeams(pageCurrent,pageSize,dataSave);
          }
        })
        .catch((err) => {
          console.log(err);
        });  
  };

/*  const onChange =(date, dateString)=> {
    console.log(date, dateString);
    var dateConvert1=new Date(Date.parse(dateString));
    console.log(dateConvert1);
    setSaveTime(dateString);
  }*/

//  console.log(teams);
  
  const columns = [
    { title: '小组', 
    dataIndex: 'teamName'
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
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
      //  console.log(record)
        return (
          <Space>
            <Button
              onClick={() => {
                props.history.push(`/team/info/${record.id}`);
              }}
            //  type='primary'
              >
              成员详情
            </Button>
            <Button
              onClick={() => {
                setShowUpdateModal(true);
                setUpdateRecord(record);
                setUpdateTeamName(record.teamName);
              }}>
              修改组名
            </Button>
            <Popconfirm title="确定要删除吗?" 
            onConfirm={() =>{ 
              handleDelete(record.id)
            }}
            >
             <Button>删除</Button>
            </Popconfirm>
          </Space>
        );
      }
    }
    
  ];

  return (
    <div>
      <Modal
        title='组名：'
        visible={showUpdateModal}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Input
          value={updateTeamName}
          onChange={e => setUpdateTeamName(e.target.value)}
        />
      </Modal>

      <Card>
        <Form
          form={form}
          name='advanced_search'
          
          className='ant-advanced-search-form'
          onFinish = {onFinish}
          >
          <Row>
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
                            <Option value="1">否</Option>
                            <Option value="0">是</Option>
                        </Select>
                 </Form.Item>
          
          
                 <Form.Item name="createTime" label="创建时间" >
                 <DatePicker 
                // onChange={onChange}
                defaultValue={ moment('00:00:00', 'HH:mm:ss') }
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
               setDataSave({});
            
                }}>
                重置
              </Button>
            </Col>
            </Form.Item>
          </Row>
        </Form>
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
          getCreatedTeams(page, pageSize,dataSave);
        },
        onShowSizeChange: (page, size) => {
          setPageCurrent(1);
          setPageSize(size);
          getCreatedTeams(1, size,dataSave);
        },
      }}
        columns={columns}
        dataSource={teams}
        rowKey={record => record.id}
      />
    </div>
  );
};

export default TeamCreatedList;
