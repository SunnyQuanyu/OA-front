import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import IndexPage from './pages/IndexPage';
import { mainRoutes } from './routes';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

function RouterConfig({ history }) {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {mainRoutes.map((route) => {
            return <Route key={route.path} {...route} />;
          })}
          {/* 子路由 */}
          <Route
            path='/'
            render={(routeProps) => <IndexPage {...routeProps} />}
          />
          {/* <Redirect to="/admin" from="/" /> */}
          <Redirect to='/404' />
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default RouterConfig;
