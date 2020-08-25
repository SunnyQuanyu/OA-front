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
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, message, Space } from 'antd';
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

  useEffect(() => {
    let userPermissionUrlSet = [];
    let permissionSet = [...props.userInfo.info.permissionSet];
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
        } else {
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
      <Menu.Item key='logOut'>
        <LogoutOutlined />
        退出
      </Menu.Item>
    </Menu>
  );

  return (
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
  );
}

export default withRouter(connect(({ userInfo }) => ({ userInfo }))(Index));
