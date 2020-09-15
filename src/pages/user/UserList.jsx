import React, { useState, useEffect } from 'react';

import UserSearchResult from '../../components/UserSearchResult';
import { Button, Popconfirm, Space, Modal, Input, Form, Row, Col, message, Table, Card, Radio, Tag, TreeSelect } from 'antd';
import http from '../../utils/axios';

const { CheckableTag } = Tag;

const UserList = props => {
  const [form] = Form.useForm();

  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [queryData, setQueryData] = useState({});
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [ifShowModal, setIfShowModal] = useState(false);
  const [updateUserPassWord, setUpdateUserPassWord] = useState('');
  const [updateUserPassWord1, setUpdateUserPassWord1] = useState('');
  const [roleMessage, setRoleMessage] = useState({});
  const [selecedRole, setSelecedRole] = useState({});
  const [updateRecord, setUpdateRecord] = useState({});
  const [uid, setUid] = useState(0);
  const [addUserIDs, setAddUserIDs] = useState([]);
  const [addRoleIDs, setAddRoleIDs] = useState([]);

  const [updateUserRealName, setUpdateUserRealName] = useState('');
  const [updateUserNumber, setUpdateUserNumber] = useState('');
  const [updateUserCollegeName, setUpdateUserCollegeName] = useState('');
  const [updateUserMajorName, setUpdateUserMajorName] = useState('');
  const [updateUserClassName, setUpdateUserClassName] = useState('');
  const [updateUserPhone, setUpdateUserPhone] = useState('');
  const [updateUserEmail, setUpdateUserEmail] = useState('');
  
  useEffect(() => {
    getPageData(pageCurrent, pageSize, queryData);
    getRoles();
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

  const identityOptions = [
    { name: '学生', value: 0 },
    { name: '老师', value: 1 },
    { name: '院长', value: 2 }
  ];
  const onFinish = values => {
    setPageCurrent(1);
    setPageSize(10);
    setQueryData(values);
    getPageData(1, 10, values);
  };

  const queryList = [
    { name: 'number', label: '学号/工号' },
    { name: 'realName', label: '姓名' },
    { name: 'collegeName', label: '学院' },
    { name: 'majorName', label: '专业' },
    { name: 'className', label: '班级' }
  ];


  const getUser = id => {
    http
        .post('/user/getUserMessage',{
         id : id,
        })
        .then((res) => {
          console.log(res);
      //    console.log(userInfo);
          if (res.data.code === 0) {
          //  setPageCurrent(1)
          //  getCreatedThings(pageCurrent,pageSize,dataSave);
        //  setUserInfo(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };


  const getPageData = (current, size, queryData) => {
    setLoading(true);
    http
      .post('/user/getUsers', {
        pageCurrent: current,
        pageSize: size,
        data: queryData
      })
      .then(res => {
        if (res.data.code === 0) {
          setPageData(res.data.data.records);
          setPageTotal(res.data.data.total);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getRoles = () => {
     http.post('/role/getRoles', {
      
    })
     .then(res => {
      if (res.data.code === 0) {
        let list = res.data.data.map(item =>{
          item.key = item.id;
          item.value = item.id;
          item.title = item.roleName;
          return item
        })
        setRoleMessage(list);
        console.log(res.data.data);
        console.log(list);
     //   console.log(list.value);
      }
    })
    .catch(err => {
      console.log(err);
    });
  };

  const onChange = (value, label, extra) => {
  setAddRoleIDs((value||[]).map(item=>{return item.value}));
  console.log((value||[]).map(item=>{return item.value}));
    console.log(label)
  };

  const handleOk = e => {
    setLoading(true);
    if(updateUserPassWord != updateUserPassWord1){
      message.warning("两次输入的密码不一致哦！");
      setLoading(false);
    }else{
      if(updateUserPassWord == ""){
    http
      .post('/user/update', {
        id: uid,
        password: updateRecord.password
      })
      .then(res => {
        if (res.data.code === 0) {
          message.warning("密码输入为空！");
          setLoading(false);
          setPageCurrent(1);
          getPageData(pageCurrent, pageSize, queryData);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }else{
      http
      .post('/user/update', {
        id: uid,
        password: updateUserPassWord
      })
      .then(res => {
        if (res.data.code === 0) {
          message.warning("密码修改成功！");
          setLoading(false);
          setPageCurrent(1);
          getPageData(pageCurrent, pageSize, queryData);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    }
    setShowUpdateModal(false);
  };

  const handleOk1 = e => {
    setLoading(true);
    http
      .post('/user/update', {
        id: uid,
        realName:updateUserRealName==""?updateRecord.realName:updateUserRealName,
        number:updateUserNumber==""?updateRecord.number:updateUserNumber,
        collegeName:updateUserCollegeName==""?updateRecord.collegeName:updateUserCollegeName,
        majorName:updateUserMajorName==""?updateRecord.majorName:updateUserMajorName,
        className:updateUserClassName==""?updateRecord.className:updateUserClassName,
        phone:updateUserPhone==""?updateRecord.phone:updateUserPhone,
        email:updateUserEmail==""?updateRecord.email:updateUserEmail
      })
      .then(res => {
        if (res.data.code === 0) {
          setLoading(false);
          setPageCurrent(1);
          getPageData(pageCurrent, pageSize, queryData);

        }
      })
      .catch(err => {
        console.log(err);
      });
    setShowUpdateUserModal(false);
  };

  const handleCancel = e => {
    setShowUpdateModal(false);
    setShowUpdateUserModal(false);
    setIfShowModal(false);
  };

  const handleOk2 = () => {
    http
      .post('/role/addUsers', {
        roleId: addRoleIDs,
        userIdList: addUserIDs
      })
      .then(res => {
        if (res.data.code === 0) {
          message.success('批量添加角色成功！');
          setIfShowModal(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };


  const userColomns = [
    { title: '学号/工号', dataIndex: 'number' },
    { title: '姓名', dataIndex: 'realName' },
    { title: '学院', dataIndex: 'collegeName' },
    { title: '专业', dataIndex: 'majorName' },
    { title: '班级', dataIndex: 'className' },
    { title: '身份', dataIndex: 'identity', render: text => text === 0 ? '学生' : text === 1 ? '老师' : '院长' },
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
              增删角色
            </Button>
            <Button
            //  type='primary'
              size='small'
              onClick={() => {
                setShowUpdateModal(true);
                setUpdateRecord(record);
                setUid(record.id);
                getUser(record.id);
         //       console.log(userInfo);
              }}>
              修改密码
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
              修改信息
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
  ]

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  return(
    <div>

      <Modal
      destroyOnClose
        title='修改密码：'
        visible={showUpdateModal}
        onOk={handleOk}
        onCancel={handleCancel}>
          <Form     
        name='advanced_search'        
        className='ant-advanced-search-form'
        {...layout}
          >
        <Form.Item name="newPassWord" label="输入新密码">
        <Input.Password 
        placeholder="输入密码" 
        onChange={e =>{
          if(e.target.value != null){
           setUpdateUserPassWord(e.target.value)
          }
          }}
        />
        </Form.Item>
        <Form.Item name="againNewPassWord" label="确认密码">
        <Input.Password
      placeholder="再次确认密码"
     onChange={e => setUpdateUserPassWord1(e.target.value)}
    />
    </Form.Item>
    </Form>
      </Modal>

      <Modal
      destroyOnClose
        title='修改信息：'
        visible={showUpdateUserModal}
        onOk={handleOk1}
        onCancel={handleCancel}>

<Form
          form={form}
          name='advanced_search'
          {...layout}
          className='ant-advanced-search-form'
>
  
          
                  <Form.Item name="realName1" label="姓名">
                    <Input 
                    defaultValue={updateRecord.realName}
                    onChange={e => setUpdateUserRealName(e.target.value)}
                    />
                  </Form.Item>
               
                  <Form.Item name="number1" label="学号">
                    <Input
                    defaultValue={updateRecord.number}
                    onChange={e => setUpdateUserNumber(e.target.value)}
                    />
                  </Form.Item>
                
           
                  <Form.Item name="collegeName1" label="学院">
                    <Input 
                    defaultValue={updateRecord.collegeName}
                    onChange={e => setUpdateUserCollegeName(e.target.value)}
                    />
                  </Form.Item>
                
          
                  <Form.Item name="majorName1" label="专业">
                    <Input
                    defaultValue={updateRecord.majorName}
                    onChange={e => setUpdateUserMajorName(e.target.value)}
                    />
                  </Form.Item>
                
          
                  <Form.Item name="className1" label="班级">
                    <Input 
                    defaultValue={updateRecord.className}
                    onChange={e => setUpdateUserClassName(e.target.value)}
                    />
                  </Form.Item>
                
          
                  <Form.Item name="phone1" label="手机号">
                    <Input 
                    defaultValue={updateRecord.phone}
                    onChange={e => setUpdateUserPhone(e.target.value)}
                    />
                  </Form.Item>
              
       
                  <Form.Item name="email1" label="邮箱">
                    <Input 
                    defaultValue={updateRecord.email}
                    onChange={e => setUpdateUserEmail(e.target.value)}
                    />
                  </Form.Item>
               
        </Form>
      </Modal>

      <Modal
      destroyOnClose
        title='批量设置用户角色：'
        visible={ifShowModal}
        onOk={handleOk2}
        onCancel={handleCancel}
        width='80%'
        >
        <Card>
        <TreeSelect
        treeCheckable
        treeCheckStrictly
        showSearch
        style={{ width: '100%' }}
      //  value={roleMessage.id||[]}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择角色"
        allowClear
        multiple
        treeDefaultExpandAll
        treeData={roleMessage}
        onChange={onChange}
        
      >
      
      </TreeSelect>


        </Card>
        <UserSearchResult
         //extraColumns={columns} 
         getSelectIds={ids => {
          setAddUserIDs(ids);
          console.log(ids);
        }}
        getSelectRows={names =>{
          console.log(names);
        }}
         />
      </Modal>
    {/*<UserSearchResult extraColumns={columns} tableSelectable={false} />*/}

    <Card>
        <Form
          form={form}
          name='advanced_search'
          onFinish={onFinish}
          className='ant-advanced-search-form'>
          <Row gutter={24}>
            {queryList.map(query => {
              return (
                <Col span={8} key={query.name}>
                  <Form.Item name={query.name} label={query.label}>
                    <Input placeholder={query.label} />
                  </Form.Item>
                </Col>
              );
            })}
            <Col span={8}>
              <Form.Item name='identity' label='身份'>
                <Radio.Group>
                  {identityOptions.map(option => {
                    return (
                      <Radio value={option.value} key={option.value}>
                        {option.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
              style={{
                textAlign: 'right'
              }}>
              <Button 
              //type='primary' 
              htmlType='submit'>
                查询
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  form.resetFields();
                }}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card 
          extra={
          
            <Button
              onClick={() => {
                 setIfShowModal(true);
              }}>
              批量设置用户角色
            </Button>           
          }
      >
    <Table
          loading={loading}
          pagination={{
            current: pageCurrent,
            pageSize: pageSize,
            total: pageTotal,
            showTotal: (total, range) =>
              ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
            onChange: (page, size) => {
              setPageCurrent(page);
              getPageData(page, size, queryData);
            },
            onShowSizeChange: (current, size) => {
              setPageCurrent(1);
              setPageSize(size);
              getPageData(current, size, queryData);
            }
          }}
          columns={userColomns}
          dataSource={pageData}
        />
        </Card>
    </div>
    );
};

export default UserList;
