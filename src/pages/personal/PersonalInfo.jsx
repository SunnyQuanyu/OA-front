import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import http from '../../utils/axios.js';
import { Descriptions, Tag, Card, Button, Modal, Input, Form, Row, Col, message } from 'antd';

const PersonalInfo = ({ dispatch }) => {
  const [userInfo, setUserInfo] = useState({});
  const [ifShowModal, setIfShowModal] = useState(false);
  const [updateUserPhone, setUpdateUserPhone] = useState('');
  const [updateUserEmail, setUpdateUserEmail] = useState('');
  useEffect(() => {
    http
      .post('/user')
      .then((res) => {
        if (res.data.code === 0) {
          setUserInfo({ ...res.data.data });
          console.log(res.data.data);
          dispatch({
            type: 'userInfo/save',
            isLogined: true,
            data: res.data.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOk = e => {
    http
      .post('/user/update', {
        id: userInfo.id,
        phone:updateUserPhone==""?userInfo.phone:updateUserPhone,
        email:updateUserEmail==""?userInfo.email:updateUserEmail
      })
      .then(res => {
        if (res.data.code === 0) {
          message.warning("修改成功！")
        }
      })
      .catch(err => {
        console.log(err);
      });
      setIfShowModal(false)
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };
  return (
    <div>
    <Modal
    destroyOnClose
      title='修改：'
      visible={ifShowModal}
      onOk={handleOk}
      onCancel={() => setIfShowModal(false)}
      >

<Form
        
        name='advanced_search'        
        className='ant-advanced-search-form'
        {...layout}
>

        
                <Form.Item name="phone1" label="手机号">
                  <Input 
                  defaultValue={userInfo.phone}
                  onChange={e => setUpdateUserPhone(e.target.value)}
                  />
                </Form.Item>
         
    
                <Form.Item name="email1" label="邮箱">
                  <Input 
                  defaultValue={userInfo.email}
                  onChange={e => setUpdateUserEmail(e.target.value)}
                  />
                </Form.Item>
         
      </Form>
    </Modal>



    <Card style={{ height: '100%' }}
    extra={
      <Button
        type='link'
        onClick={() => {
          setIfShowModal(true);
        }}>
        修改
      </Button>
    }
    >
      <Descriptions title='个人信息'>
        <Descriptions.Item label='姓名'>{userInfo.realName}</Descriptions.Item>
        <Descriptions.Item label='学号'>{userInfo.number}</Descriptions.Item>
        <Descriptions.Item label='学院'>
          {userInfo.collegeName}
        </Descriptions.Item>
        <Descriptions.Item label='绑定微信'>
          {userInfo.wxOpenId === undefined || userInfo.wxOpenId === null
            ? '否'
            : '是'}
        </Descriptions.Item>
        {userInfo.majorName && (
          <Descriptions.Item label='专业'>
            {userInfo.majorName}
          </Descriptions.Item>
        )}
        {userInfo.className && (
          <Descriptions.Item label='班级'>
            {userInfo.className}
          </Descriptions.Item>
        )}
        {userInfo.phone && (
          <Descriptions.Item label='手机号'>{userInfo.phone}</Descriptions.Item>
        )}
        {userInfo.email && (
          <Descriptions.Item label='邮箱'>{userInfo.email}</Descriptions.Item>
        )}

        {userInfo.roleList && (
          <Descriptions.Item label='角色'>
            {userInfo.roleList.map((role) => {
              return (
                <Tag color='success' key={role.id} style={{ margin: '4px' }}>
                  {role.roleName}
                </Tag>
              );
            })}
          </Descriptions.Item>
        )}
        
        {userInfo.permissionSet && (
          <Descriptions.Item label='权限'>
            {userInfo.permissionSet.map((permission) => {
              return (
                <Tag
                  color='processing'
                  key={permission.id}
                  style={{ margin: '4px' }}>
                  {permission.permissionName}
                </Tag>
              );
            })}
          </Descriptions.Item>
        )}
        
      </Descriptions>
    </Card>
    </div>
  );
};

export default connect(({ userInfo }) => ({ userInfo }))(PersonalInfo);
