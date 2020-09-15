import React, { useEffect, useState } from 'react';
import { Tag, Card, Table, Button, Modal, Space, Input, Form, Row, Col, Select, DatePicker, Popconfirm, message } from 'antd';
import moment from 'moment';
import http from '../../utils/axios';
const { Option } = Select;

const PermissionList = props => {
  const [form] = Form.useForm();
  const [records, setRecords] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRecord, setUpdateRecord] = useState({});
  const [updatePermissionName, setUpdatePermissionName] = useState({});
  const [updateFrontRoute, setUpdateFrontRoute] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSave, setDataSave] = useState({});
  const [pageTotal, setPageTotal] = useState(0);
  const [ifShowModal, setIfShowModal] = useState(false);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [newFrontRoute, setNewFrontRoute] = useState("");


  const getPermissionList = (current, size, data) => {
    setLoading(true);
    http
      .post('/permissionList', {
        pageCurrent: current,
        pageSize: size,
        data: data,
      })
      .then(res => {
        console.log(res.data);
        if (res.data.code === 0) {
          setRecords(res.data.data);
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
    getPermissionList(pageCurrent, pageSize, dataSave);
  }, []);

  const onFinish = value => {
    
    setPageCurrent(1);
    setPageSize(10);
    console.log(value)
  setDataSave(value);
  getPermissionList(1, 10, value);

  };

  const handleDelete = id => {
    http
        .post('/deletePermission',{
         id : id,
        })
        .then((res) => {
          console.log(res);
          if (res.data.data === 1) {
            setPageCurrent(1);
            setDataSave(records);
            getPermissionList(pageCurrent,pageSize,dataSave);
          }
        })
        .catch((err) => {
          console.log(err);
        });  
  };

  const handleOk = e => {
    http
      .post('/update', {
        id: updateRecord.id,
        permissionName: updatePermissionName,
        frontRoute: updateFrontRoute
      })
      .then(res => {
        if (res.data.code === 0) {
          getPermissionList(pageCurrent, pageSize, dataSave);
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

  const handleOk1 = e => {
    http
      .post("/addPermission", {
         permissionName: newPermissionName,
         frontRoute: newFrontRoute 
        })
      .then(res => {
        if (res.data.code === 0) {
          getPermissionList(pageCurrent,pageSize,dataSave);
          setIfShowModal(false);
          message.success("添加成功!");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const columns = [
    { title: '权限名', 
    dataIndex: 'permissionName',
    },
    {
      title: '前端路径',
      dataIndex: 'frontRoute',
    },
    { title: '创建人', 
    dataIndex: 'realName'
    },
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
                  setShowUpdateModal(true);
                  setUpdateRecord(record);
                  setUpdatePermissionName(record.permissionName);
                  setUpdateFrontRoute(record.frontRoute);
                console.log(record.permissionName)
                }}>
                修改
              </Button>
              <Popconfirm title="确定要删除吗?" 
              onConfirm={() =>{ 
                handleDelete(record.id);
                console.log(record.id);
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

  return (

<div>

<Modal
        title='修改：'
        visible={showUpdateModal}
        onOk={handleOk}
        onCancel={handleCancel}>
          <h5>权限名：</h5>
        <Input
          value={updatePermissionName}
          onChange={e => setUpdatePermissionName(e.target.value)}
        />
        <h5>前端路径：</h5>
        <Input
          value={updateFrontRoute}
          onChange={e => setUpdateFrontRoute(e.target.value)}
        />
      </Modal>

      <Modal
        title='新增权限'
        visible={ifShowModal}
        onOk={handleOk1}
        onCancel={() => setIfShowModal(false)}>
        <p>权限名：</p>
        <Input
          label='权限名'
          onChange={e => {
            setNewPermissionName(e.target.value);
          }}
        />
        <p>前端路径：</p>
        <Input
          label='前端路径名'
          onChange={e => {
            setNewFrontRoute(e.target.value);
          }}
        />
      </Modal>

<Card>
        <Form
          form={form}
          name='advanced_search'     
          className='ant-advanced-search-form'
          onFinish = {onFinish}
          >
          <Row gutter={24}>
             
                  <Form.Item name="permissionName" label="权限名">
                    <Input 
                    placeholder="权限名" 
                    />
                  </Form.Item>  
                               
          </Row>
          <Row>
         
          <Form.Item>

              <Button 
         //       type='primary' 
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
            
            </Form.Item>
         
          </Row>
        </Form>
        <Button
           onClick={() => setIfShowModal(true)}>
           新增权限
        </Button>
      </Card>
      <Table
      pagination={{
        showTotal: (total, range) =>
      ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
    }}
        columns={columns}
        dataSource={records}
        rowKey={record => record.id}
      />
</div>

  );
};

export default PermissionList;
