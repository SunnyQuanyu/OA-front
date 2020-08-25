import React, { useState, useEffect } from 'react';
import { Card, Tag, message, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import http from '../../utils/axios';
import style from './roleList.css';

const Role = props => {
  const [roleName, setRoleName] = useState('');
  const [rolePermissions, setRolePermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  // role
  const getRole = () => {
    return http.post('/role/getRole', {
      id: props.match.params.id
    });
  };
  const getPermissions = () => {
    return http.post('/permissions');
  };
  useEffect(() => {
    Promise.all([getRole(), getPermissions()])
      .then(res => {
        const roleRes = res[0];
        const permissionsRes = res[1];
        if (roleRes.data.code === 0 && permissionsRes.data.code === 0) {
          let rolePerms = roleRes.data.data.permissionList;
          // 从所有权限中剔除该角色已经有的权限
          let tempPerms = permissionsRes.data.data;
          for (let i = 0; i < tempPerms.length; i++) {
            const perm = tempPerms[i];
            rolePerms.forEach(rolePerm => {
              if (perm.id === rolePerm.id) {
                tempPerms.splice(i, 1);
                i--;
              }
            });
          }
          setRoleName(roleRes.data.data.roleName);
          setRolePermissions(rolePerms);
          setAllPermissions(tempPerms);
        }
      })
      .catch(err => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelPerm = permission => {
    http
      .post('/role/delPermission', {
        roleId: props.match.params.id,
        permissionId: permission.id
      })
      .then(res => {
        if (res.data.code === 0) {
          // 把权限信息加入可选权限
          setAllPermissions([...allPermissions, permission]);
          // 把权限信息从当前权限中剔除
          for (let i = 0; i < rolePermissions.length; i++) {
            const perm = rolePermissions[i];
            if (perm.id === permission.id) {
              rolePermissions.splice(i, 1);
              i--;
            }
          }
          setRolePermissions([...rolePermissions]);

          message.info('删除成功!');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleAddPerm = permission => {
    http
      .post('/role/addPermission', {
        roleId: props.match.params.id,
        permissionId: permission.id
      })
      .then(res => {
        if (res.data.code === 0) {
          // 把权限信息加入当前角色
          setRolePermissions([...rolePermissions, permission]);
          // 把权限信息从可选权限中剔除
          for (let i = 0; i < allPermissions.length; i++) {
            const perm = allPermissions[i];
            if (perm.id === permission.id) {
              allPermissions.splice(i, 1);
              i--;
            }
          }
          setAllPermissions([...allPermissions]);

          message.success('添加成功!');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <Button
        onClick={() => {
          props.history.go(-1);
        }}>
        返回
      </Button>
      <div className={style.cardsWrapper}>
        <RoleCard
          title={'当前角色: ' + roleName}
          permissionList={rolePermissions}
          icon={<CloseOutlined />}
          handleClick={handleDelPerm}
          color='green'
        />
        <RoleCard
          title={'可选权限'}
          permissionList={allPermissions}
          icon={<PlusOutlined />}
          handleClick={handleAddPerm}
          color='purple'
        />
      </div>
    </div>
  );
};

/**
 * title: 标题
 * permissionList 对应的权限列表
 * icon: 每个权限前面的icon
 * handleClick(permission): 点击后的回调函数,permissiond对应permissionList的一个元素
 * color: 颜色
 * @param {*} props
 */
const RoleCard = ({ title, permissionList, icon, handleClick, color }) => {
  return (
    <Card title={title} className={style.myCard}>
      {permissionList.map(permission => {
        if (permission.frontRoute.indexOf('/sys/role') !== -1) {
          return (
            <Tag key={permission.id} color='red' className={style.myTag}>
              {permission.permissionName}
            </Tag>
          );
        }
        return (
          <Tag
            key={permission.id}
            icon={icon}
            color={color}
            className={style.myTag}
            onClick={() => handleClick(permission)}>
            {permission.permissionName}
          </Tag>
        );
      })}
    </Card>
  );
};

export default Role;
