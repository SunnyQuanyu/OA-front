import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import UserAdd from './pages/user/UserAdd';
import PersonalInfo from './pages/personal/PersonalInfo';
import RoleList from './pages/role/RoleList';
import Role from './pages/role/Role';
import UserList from './pages/user/UserList';
import TeamEdit from './pages/team/TeamEdit';
import TeamJoinedList from './pages/team/TeamJoinedList';
import TeamCreatedList from './pages/team/TeamCreatedList';
import UserEdit from './pages/user/UserEdit';
import TeamInfo from './pages/team/TeamInfo';
import TeamJoined from './pages/team/TeamJoined';
import Tags from './pages/tag/Tags';
import TagEdit from './pages/tag/TagEdit';
import TagEditPublic from './pages/tag/TagEditPublic';
import ThingAdd from './pages/thing/ThingAdd';
import ThingJoinedList from './pages/thing/ThingJoinedList';
import ThingJoined from './pages/thing/ThingJoined';
import ThingCreatedList from './pages/thing/ThingCreatedList';
import ThingCreated from './pages/thing/ThingCreated';
import ThingUserReply from './pages/thing/ThingUserReply';
import ThingAddPersonal from './pages/thing/ThingAddPersonal';
import ThingTeam from './pages/thing/ThingTeam';
import WXbind from './pages/personal/WXbind';

export const mainRoutes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/404',
    component: PageNotFound,
  },
];

export const thingRoutes = [
  {
    path: '/thing/joinedlist',
    component: ThingJoinedList,
    exact: true,
    isShow: true,
    title: '日程表',
  },
  {
    path: '/thing/joined/:id',
    component: ThingJoined,
    exact: true,
    isShow: false,
    title: '收到事务详情页',
  },
  {
    path: '/thing/edit',
    component: ThingAdd,
    exact: true,
    isShow: true,
    controlled: true,
    title: '创建事务',
  },
  {
    path: '/thing/createdlist',
    component: ThingCreatedList,
    exact: true,
    isShow: true,
    controlled: true,
    title: '已创建事务列表',
  },
  {
    path: '/thing/created/:id',
    component: ThingCreated,
    exact: true,
    isShow: false,
    controlled: true,
    title: '已创建事务详情',
  },
  {
    path: '/thing/created/:thingId/:userId',
    component: ThingUserReply,
    exact: true,
    isShow: false,
    controlled: true,
    title: '某人已完成事务详情',
  },
  {
    path: '/thing/personalEdit',
    component: ThingAddPersonal,
    exact: true,
    isShow: true,
    title: '创建个人事务',
  },
  {
    path: '/thing/thingDetail/:id',
    component: ThingTeam,
    exact: true,
    isShow: false,
    controlled: true,
  },
];

export const teamRoutes = [
  {
    path: '/team/joinedList',
    component: TeamJoinedList,
    exact: true,
    isShow: true,
    title: '我的小组',
  },
  {
    path: '/team/edit',
    component: TeamEdit,
    exact: true,
    isShow: true,
    controlled: true,
    title: '创建小组',
  },
  {
    path: '/team/createdlist',
    component: TeamCreatedList,
    exact: true,
    isShow: true,
    controlled: true,
    title: '已创建小组列表',
  },
  {
    path: '/team/info/:id',
    component: TeamInfo,
    exact: true,
    isShow: false,
  },
  {
    path: '/team/joined/:id',
    component: TeamJoined,
    exact: true,
    isShow: false,
    controlled: true,
  },
];

export const roleRoutes = [
  {
    path: '/sys/roles',
    component: RoleList,
    exact: true,
    isShow: true,
    controlled: true,
    title: '角色管理',
  },
  {
    path: '/sys/role/:id',
    component: Role,
    exact: true,
    isShow: false,
    controlled: true,
    title: '修改角色权限',
  },
];

export const tagRoutes = [
  {
    path: '/tag/list',
    component: Tags,
    exact: true,
    isShow: true,
    title: '可用标签',
  },
  {
    path: '/tag/edit',
    component: TagEdit,
    exact: true,
    isShow: false,
    title: '创建私有标签',
  },
  {
    path: '/tag/editpub',
    component: TagEditPublic,
    exact: true,
    isShow: true,
    controlled: true,
    title: '创建共有标签',
  },
];

export const userOperateRoutes = [
  {
    path: '/user/addusers',
    component: UserAdd,
    exact: true,
    isShow: true,
    controlled: true,
    title: '添加用户',
  },
  {
    path: '/user/list',
    component: UserList,
    exact: true,
    isShow: true,
    controlled: true,
    title: '所有用户',
  },
  {
    path: '/user/edit/:id',
    component: UserEdit,
    exact: true,
    isShow: false,
    controlled: true,
    title: '更新用户信息',
  },
];

export const userRoutes = [
  {
    path: '/u/info',
    component: PersonalInfo,
    exact: true,
    isShow: false,
    title: '个人信息',
  },
  {
    path: '/u/wxbind',
    component: WXbind,
    exact: true,
    isShow: false,
  },
];

// export const testRoutes = [
//   {
//     path: '/test/Vote',
//     component: ThingAddQuestion,
//     exact: true,
//     isShow: true,
//     title: '投票模块'
//   }
// ];

export const adminRoutes = [
  ...thingRoutes,
  ...teamRoutes,
  ...roleRoutes,
  ...tagRoutes,
  ...userOperateRoutes,
  ...userRoutes,
  // ...testRoutes
];
export const routesGroup = {
  thingRoutes,
  teamRoutes,
  roleRoutes,
  tagRoutes,
  userOperateRoutes,
  userRoutes,
  // testRoutes
};
