import React, { useState, useEffect } from "react";
import http from "../../utils/axios";
import { Card, Tag, Button, Modal, Input, message, Popconfirm } from "antd";
import style from "./roleList.css";

const RoleList = props => {
  const [roleList, setRoleList] = useState([]);
  const [ifShowModal, setIfShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [updateRecord, setUpdateRecord] = useState("");
  const [updateRoleName, setUpdateRoleName] = useState("");

  const getRoles = () => {
    http
      .post("/role/getRoles")
      .then(res => {
        if (res.data.code === 0) {
          setRoleList(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    getRoles();
  }, []);

  const handleOk = e => {
    http
      .post("/role/add", { roleName: newRoleName })
      .then(res => {
        if (res.data.code === 0) {
          getRoles();
          setIfShowModal(false);
          message.success("添加成功!");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleOk1 = e => {
    http
      .post("/role/update", { 
      /*  role: updateRecord*/
        id : updateRecord.id,
        roleName: updateRoleName 
      })
      .then(res => {
        if (res.data.code === 0) {
          getRoles();
          setShowUpdateModal(false);
          message.success("修改成功!");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleDelete = id => {
    http
        .post('/role/deleteRole',{
         id : id,
        })
        .then((res) => {
          console.log(res);
          if (res.data.data === 1) {
            getRoles();
          }
        })
        .catch((err) => {
          console.log(err);
        });  
  };
  return (
    <div>
      <Button
        type='danger'
        size='middle'
        className={style.myButton}
        onClick={() => setIfShowModal(true)}>
        添加角色
      </Button>
      <div className={style.cardsWrapper}>
        {roleList.map(role => {
          return (
            <Card
              key={role.id}
              title={role.roleName}
              className={style.myCard}
              extra={
                <div>
                <Button
                  type='link'
                  onClick={() => {
                    props.history.push(`/sys/role/${role.id}`);
                  }}>
                  管理
                </Button>
                <Button
                  type='link'
                  onClick={() => {
                    setUpdateRecord(role);
                    console.log(role);
                    setShowUpdateModal(true);
                  }}>
                  改名
                </Button>
                <Popconfirm title="确定要删除吗?" 
              onConfirm={() =>{ 
                handleDelete(role.id);
              }}
              >
               <Button type='link' size='small'>删除</Button>
              </Popconfirm>
                </div>
              }
              hoverable
              bordered={false}>
              {role.permissionList.map(permission => {
                return (
                  <Tag
                    key={permission.id}
                    color='green'
                    className={style.myTag}>
                    {permission.permissionName}
                  </Tag>
                );
              })}
            </Card>
          );
        })}
      </div>
      <Modal
      destroyOnClose
        title='添加角色'
        visible={ifShowModal}
        onOk={handleOk}
        onCancel={() => setIfShowModal(false)}>
        <p>请输入角色名</p>
        <Input
          label='角色名'
          onChange={e => {
            setNewRoleName(e.target.value);
          }}
        />
      </Modal>
      <Modal
      destroyOnClose
        title='更改角色名'
        visible={showUpdateModal}
        onOk={handleOk1}
        onCancel={() => setShowUpdateModal(false)}>
        <Input
          defaultValue={updateRecord.roleName}
          onChange={e => {
            setUpdateRoleName(e.target.value);
            console.log(updateRoleName);
            updateRecord.roleName = e.target.value;
            console.log(updateRecord);
          }}
        />
      </Modal>
    </div>
  );
};

export default RoleList;
