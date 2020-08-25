import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import Frame from '../components/Frame/Index.jsx';
import { Route, Switch, Redirect } from 'dva/router';
import { adminRoutes, mainRoutes } from '../routes';
import http from '../utils/axios.js';
import { Spin } from 'antd';

/**
 * 子路由
 * @param {*} props
 */
function IndexPage({ dispatch, userInfo }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIfLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIfLogin = params => {
    setLoading(true);
    http
      .post('/user')
      .then(res => {
        if (res.data.code === 0) {
          dispatch({
            type: 'userInfo/save',
            isLogined: true,
            data: res.data.data
          });
        } else {
          console.log('res.data.data', res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  return loading ? (
    <Spin
      size='large'
      style={{
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate3d(-50%, -50%, 0)'
      }}
    />
  ) : userInfo.isLogined ? (
    <Frame>
      <Switch>
        {adminRoutes.map(route => {
          return (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={routeProps => {
                return <route.component {...routeProps} />;
              }}
            />
          );
        })}
        {/* <Redirect to={mainRoutes[1].path} /> */}
        <Route path='*' component={mainRoutes[1].component} />
      </Switch>
    </Frame>
  ) : (
    <Redirect to='/login' />
  );
}

IndexPage.propTypes = {};

export default connect(({ userInfo }) => ({ userInfo }))(IndexPage);
