import React, { useState, useEffect } from 'react';

import UserSearchResult from '../../components/UserSearchResult';
import { Button, Popconfirm, Space, Modal, Input, Form, Row, Col } from 'antd';
import http from '../../utils/axios';


const UserList = props => {
  const [form] = Form.useForm();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [updateUserPassWord, setUpdateUserPassWord] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [updateRecord, setUpdateRecord] = useState({});
  const [uid, setUid] = useState(0);

  useEffect(() => {
  
  }, []);

  const handleDelete = id => {
    http
        .post('/user/deleteUsers',{
         id : id,
        })
        .then((res) => {
          console.log(res);
          if (res.data.data === 1) {
          //  setPageCurrent(1)
          //  getCreatedThings(pageCurrent,pageSize,dataSave);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    
   
  };

  const getUser = id => {
    http
        .post('/user/getUserMessage',{
         id : id,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
          //  setPageCurrent(1)
          //  getCreatedThings(pageCurrent,pageSize,dataSave);
          setUserInfo(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleOk = e => {
    http
      .post('/user/update', {
        id: uid,
        password: updateUserPassWord
      })
      .then(res => {
        if (res.data.code === 0) {
         // getCreatedTeams(pageCurrent, pageSize, dataSave);
        }
      })
      .catch(err => {
        console.log(err);
      });
    setShowUpdateModal(false);
    setShowUpdateUserModal(false);
  };

  const handleCancel = e => {
    setShowUpdateModal(false);
    setShowUpdateUserModal(false);
  };


  const columns = [
    {
      title: '操作',
      render: (txt, record, index) => {
        return (
          <div>
            <Space>
            <Button
            //  type='primary'
              size='small'
              onClick={() => {
                props.history.push(`/user/edit/${record.id}`);
              }}>
              修改用户角色
            </Button>
            <Button
            //  type='primary'
              size='small'
              onClick={() => {
                setShowUpdateModal(true);
                setUpdateRecord(record);
                setUid(record.id);
                getUser(record.id);
                console.log(userInfo);
              }}>
              修改用户密码
            </Button>
            <Button
            //  type='primary'
              size='small'
              onClick={() => {
                setShowUpdateUserModal(true);
                setUpdateRecord(record);
                setUid(record.id);
                getUser(record.id);
              //  console.log(userInfo);
              }}>
              修改用户信息
            </Button>
            <Popconfirm title="确定要删除吗?" 
            onConfirm={() =>{ 
              handleDelete(record.id)
            }}
            >
             <Button size='small'>删除</Button>
            </Popconfirm>
            </Space>
          </div>
        );
      }
    }
  ];

  return(
    <div>

      <Modal
        title='修改用户密码：'
        visible={showUpdateModal}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Input
          value={updateRecord.password}
          onChange={e => setUpdateUserPassWord(e.target.value)}
        />
      </Modal>

      <Modal
        title='修改用户信息：'
        visible={showUpdateUserModal}
        onOk={handleOk}
        onCancel={handleCancel}>

<Form
          form={form}
          name='advanced_search'
          
          className='ant-advanced-search-form'
         // onFinish = {onFinish}
          >
          <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="realName" label="姓名">
                    <Input 
                    placeholder={updateRecord.realName} 
                    />
                  </Form.Item>
                </Col>
                </Row>
           <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="number" label="学号">
                    <Input 
                    placeholder={updateRecord.number} 
                    />
                  </Form.Item>
                </Col>
           </Row>
           <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="collegeName" label="学院">
                    <Input 
                    placeholder={updateRecord.collegeName} 
                    />
                  </Form.Item>
                </Col>
                </Row>
           <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="majorName" label="专业">
                    <Input 
                    placeholder={updateRecord.majorName} 
                    />
                  </Form.Item>
                </Col>
                </Row>
          <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="className" label="班级">
                    <Input 
                    placeholder={updateRecord.className} 
                    />
                  </Form.Item>
                </Col>
                </Row>
          <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="phone" label="手机号">
                    <Input 
                    placeholder={updateRecord.phone} 
                    />
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
              //  type='primary' 
                htmlType='submit'                
                >
                保存
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  form.resetFields();
            
                }}>
                重置
              </Button>
            </Col>
            </Form.Item>
          </Row>
        </Form>
      </Modal>

    <UserSearchResult extraColumns={columns} tableSelectable={false} />
    </div>
    );
};

export default UserList;
