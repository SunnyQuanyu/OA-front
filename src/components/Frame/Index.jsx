import {
  CarryOutOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  SettingTwoTone,
  SmileOutlined,
  TagsOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, message, Space, Input, Form, Modal } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import React, { useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import { routesGroup } from '../../routes';
import { clearToken } from '../../utils/authc';
import style from './frame.css';
import http from '../../utils/axios';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function Index(props) {
  const [thingRoutes, setThingRoutes] = useState([]);
  const [teamRoutes, setTeamRoutes] = useState([]);
  const [roleRoutes, setRoleRoutes] = useState([]);
  const [tagRoutes, setTagRoutes] = useState([]);
  const [userOperateRoutes, setUserOperateRoutes] = useState([]);
  // const [testRoutes, setTestRoutes] = useState([]);
  const [ifShowModal, setIfShowModal] = useState(false);
  const [updateUserPassWord, setUpdateUserPassWord] = useState('');
  const [updateUserPassWord1, setUpdateUserPassWord1] = useState('');
  const [userOldPassWord, setUserOldPassWord] = useState('');

  useEffect(() => {
    let userPermissionUrlSet = [];
    let permissionSet = [...props.userInfo.info.permissionSet];
    console.log(permissionSet);
    console.log(props.userInfo.info);
    permissionSet.forEach((permission) => {
      userPermissionUrlSet.push(permission.frontRoute);
    });
    let tempRoutesGroup = JSON.parse(JSON.stringify(routesGroup));
    // 从 userPermissionSet 中 解除对应route的受控
    for (const key in tempRoutesGroup) {
      if (tempRoutesGroup.hasOwnProperty(key)) {
        const routes = tempRoutesGroup[key];
        routes.forEach((route) => {
          if (userPermissionUrlSet.indexOf(route.path) !== -1) {
            route.controlled = false;
          }
        });
      }
    }
    setThingRoutes(
      tempRoutesGroup.thingRoutes.filter(
        (route) => route.isShow && !route.controlled
      )
    );
    setTeamRoutes(
      tempRoutesGroup.teamRoutes.filter(
        (route) => route.isShow && !route.controlled
      )
    );
    setRoleRoutes(
      tempRoutesGroup.roleRoutes.filter(
        (route) => route.isShow && !route.controlled
      )
    );
    setTagRoutes(
      tempRoutesGroup.tagRoutes.filter(
        (route) => route.isShow && !route.controlled
      )
    );
    setUserOperateRoutes(
      tempRoutesGroup.userOperateRoutes.filter(
        (route) => route.isShow && !route.controlled
      )
    );
    // setTestRoutes(
    //   routesGroup.testRoutes.filter(route => route.isShow && !route.controlled)
    // );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const handleOk = e => {
    if(userOldPassWord != props.userInfo.info.password){
      message.warning("原密码输入有误！");
    }else{
      if(updateUserPassWord != updateUserPassWord1){
        message.warning("两次输入的密码不一致哦！");
      }else{
          if(updateUserPassWord == ""){
            message.warning("密码输入为空！");
        }else{
          http
          .post('/user/update', {
            id: props.userInfo.info.id,
            password: updateUserPassWord
          })
          .then(res => {
            if (res.data.code === 0) {
              message.warning("密码修改成功，请重新登录");
              http
            .post('/user/logout')
            .then((res) => {
              if (res.data.code === 0) {
                // 一定要先清除token
                clearToken();
                props.dispatch({
                  type: 'userInfo/save',
                  isLogined: false,
                });
                props.history.push('/login');
              }
            })
            .catch((err) => {
              console.log(err);
            });
            }
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
  }
    setIfShowModal(false);
  };

  // 鼠标滑到右上角用户上时候的弹出菜单
  const popMenu = (
    <Menu
      onClick={(p) => {
        if (p.key === 'logOut') {
          http
            .post('/user/logout')
            .then((res) => {
              if (res.data.code === 0) {
                // 一定要先清除token
                clearToken();
                props.dispatch({
                  type: 'userInfo/save',
                  isLogined: false,
                });
                props.history.push('/login');
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (p.key === 'info') {
          props.history.push('/u/info');
        } else if (p.key === 'update') {
          setIfShowModal(true);
        }else {
          message.info(p.key);
        }
      }}>
      <Menu.Item key='noti'>通知中心</Menu.Item>
      <Menu.Item key='info'>
        <SmileOutlined />
        个人信息
      </Menu.Item>
      <Menu.Item key='setting'>
        <SettingOutlined />
        设置
      </Menu.Item>
      <Menu.Item key='update'>
      <KeyOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key='logOut'>
        <LogoutOutlined />
        退出
      </Menu.Item>
    </Menu>
  );

  return (
<div>
    <Modal
      destroyOnClose
        title='修改密码：'
        visible={ifShowModal}
        onOk={handleOk}
        onCancel={() => setIfShowModal(false)}
      >
          <Form     
        name='advanced_search'        
        className='ant-advanced-search-form'
        {...layout}
          >
       <Form.Item name="oldPassWord" label="原密码">
        <Input 
      //  defaultValue={props.userInfo.info.password}
      onChange={e =>{
        if(e.target.value != null){
          setUserOldPassWord(e.target.value)
        }
        }}
        />
        </Form.Item>
        <Form.Item name="newPassWord" label="输入新密码">
        <Input.Password 
        placeholder="输入新密码" 
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
     onChange={e =>
       setUpdateUserPassWord1(e.target.value)
    }
    />
    </Form.Item>
    </Form>
      </Modal>

    <Layout className={style.main}>
      <Header className={style.header}>
        <Space>
          <img src={Logo} alt='logo' className={style.logo} />
          <span className={style.headerTitle}>自动化办公管理系统</span>
        </Space>
        <Dropdown overlay={popMenu}>
          <div>
            <Avatar>U</Avatar>
            <span style={{ color: '#fff', margin: '0 10px' }}>
              {props.userInfo.info.realName} <DownOutlined />
            </span>
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} className={style.sider}>
          <Menu
            mode='inline'
            defaultSelectedKeys={['/admin/thing']}
            defaultOpenKeys={['thingRoutes']}
            style={{ height: '100%', borderRight: 0 }}>
            {/* 事务管理 */}
            <SubMenu
              key='thingRoutes'
              title={
                <span>
                  <CarryOutOutlined />
                  事务管理
                </span>
              }>
              {thingRoutes.map((route) => {
                return (
                  <Menu.Item
                    key={route.path}
                    onClick={(p) => props.history.push(p.key)}>
                    {route.title}
                  </Menu.Item>
                );
              })}
            </SubMenu>
            {/* 标签管理 */}
            <SubMenu
              key='tagRoutes'
              title={
                <span>
                  <TagsOutlined />
                  标签管理
                </span>
              }>
              {tagRoutes.map((route) => {
                return (
                  <Menu.Item
                    key={route.path}
                    onClick={(p) => props.history.push(p.key)}>
                    {route.title}
                  </Menu.Item>
                );
              })}
            </SubMenu>
            {/* 小组管理 */}
            <SubMenu
              key='teamRoutes'
              title={
                <span>
                  <TeamOutlined />
                  小组管理
                </span>
              }>
              {teamRoutes.map((route) => {
                return (
                  <Menu.Item
                    key={route.path}
                    onClick={(p) => props.history.push(p.key)}>
                    {route.title}
                  </Menu.Item>
                );
              })}
            </SubMenu>
            {/* 用户管理 */}
            {userOperateRoutes.length !== 0 && (
              <SubMenu
                key='userOperateRoutes'
                title={
                  <span>
                    <UserSwitchOutlined />
                    用户管理
                  </span>
                }>
                {userOperateRoutes.map((route) => {
                  return (
                    <Menu.Item
                      key={route.path}
                      onClick={(p) => props.history.push(p.key)}>
                      {route.title}
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            )}
            {/* 角色权限管理 */}
            {roleRoutes.length !== 0 && (
              <SubMenu
                key='roleRoutes'
                title={
                  <span>
                    <SettingTwoTone />
                    角色权限管理
                  </span>
                }>
                {roleRoutes.map((route) => {
                  console.log(route);
                  console.log(roleRoutes);
                  return (
                    
                    <Menu.Item
                      key={route.path}
                      onClick={(p) => props.history.push(p.key)}>
                      {route.title}
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            )}
            {/* 测试用 */}
            {/* <SubMenu
              key='testRoutes'
              title={
                <span>
                  <UserOutlined />
                  测试用
                </span>
              }>
              {testRoutes.map(route => {
                return (
                  <Menu.Item
                    key={route.path}
                    onClick={p => props.history.push(p.key)}>
                    {route.title}
                  </Menu.Item>
                );
              })}
            </SubMenu> */}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0' }}>
          <Content className={style.content}>{props.children}</Content>
        </Layout>
      </Layout>
    </Layout>
    </div>
  );
}

export default withRouter(connect(({ userInfo }) => ({ userInfo }))(Index));
