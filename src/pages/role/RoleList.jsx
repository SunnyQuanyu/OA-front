import React, { useState, useEffect } from "react";
import http from "../../utils/axios";
import { Card, Tag, Button, Modal, Input, message } from "antd";
import style from "./roleList.css";

const RoleList = props => {
  const [roleList, setRoleList] = useState([]);
  const [ifShowModal, setIfShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

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
                <Button
                  type='link'
                  onClick={() => {
                    props.history.push(`/sys/role/${role.id}`);
                  }}>
                  管理
                </Button>
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
    </div>
  );
};

export default RoleList;
