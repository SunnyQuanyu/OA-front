import React, { useState, useEffect } from 'react';
import { Descriptions, Tag, Card, Divider, Typography, message } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import http from '../../utils/axios.js';

const { Text } = Typography;

const UserEdit = props => {
  const [userInfo, setUserInfo] = useState({ roleList: [], permissionSet: [] });
  const [rolesOptions, setRolesOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRoles(), getUser()]).then(res => {
      const rolesRes = res[0];
      const userRes = res[1];
      if (rolesRes.data.code === 0 && userRes.data.code === 0) {
        let tempRoles = rolesRes.data.data;
        let tempUser = userRes.data.data;
        for (let i = 0; i < tempRoles.length; i++) {
          const role = tempRoles[i];
          tempUser.roleList.forEach(r => {
            if (r.id === role.id) {
              tempRoles.splice(i--, 1);
            }
          });
        }
        setRolesOptions(tempRoles);
        setUserInfo(tempUser);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRoles = () => {
    return http.post('/role/getRoles');
  };
  const getUser = () => {
    return http.post('/user/get', { id: props.match.params.id });
  };

  const handleDelRole = role => {
    http
      .post('/user/delRole', {
        roleId: role.id,
        userId: props.match.params.id
      })
      .then(res => {
        if (res.data.code === 0) {
          let userRoles = userInfo.roleList;
          for (let i = 0; i < userRoles.length; i++) {
            const r = userRoles[i];
            if (r.id === role.id) {
              userRoles.splice(i--, 1);
              break;
            }
          }
          setRolesOptions([...rolesOptions, role]);
          setUserInfo({ ...userInfo, roleList: userRoles });
          message.info('移除成功！');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleAddRole = role => {
    http
      .post('/user/addRole', {
        roleId: role.id,
        userId: props.match.params.id
      })
      .then(res => {
        if (res.data.code === 0) {
          for (let i = 0; i < rolesOptions.length; i++) {
            const option = rolesOptions[i];
            if (option.id === role.id) {
              rolesOptions.splice(i--, 1);
              break;
            }
          }
          setRolesOptions([...rolesOptions]);
          setUserInfo({ ...userInfo, roleList: [...userInfo.roleList, role] });
          message.success('添加成功！');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <Card>
        <Descriptions title='该用户详细信息'>
          <Descriptions.Item label='姓名'>
            {userInfo.realName}
          </Descriptions.Item>
          <Descriptions.Item label='学号'>{userInfo.number}</Descriptions.Item>
          <Descriptions.Item label='学院'>
            {userInfo.collegeName}
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
            <Descriptions.Item label='手机号'>
              {userInfo.phone}
            </Descriptions.Item>
          )}
        </Descriptions>
        <Divider />
        <Text strong>用户已有角色，点击删除:</Text>
        <br />
        {userInfo.roleList.map(option => {
          return (
            <Tag
              color='geekblue'
              key={option.id}
              icon={<CloseOutlined />}
              onClick={() => {
                handleDelRole(option);
              }}>
              {option.roleName}
            </Tag>
          );
        })}
        <Divider />
        <Text strong>可选用户角色，点击添加:</Text>
        <br />
        {rolesOptions.map(option => {
          return (
            <Tag
              color='green'
              key={option.id}
              icon={<PlusOutlined />}
              onClick={() => {
                handleAddRole(option);
              }}>
              {option.roleName}
            </Tag>
          );
        })}
      </Card>
    </div>
  );
};

export default UserEdit;
