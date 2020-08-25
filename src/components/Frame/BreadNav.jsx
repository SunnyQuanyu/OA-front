import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';

const BreadNav = ({ navs }) => {
  return (
    <Breadcrumb style={{ position: 'absolute', top: '73px' }}>
      {navs.map(nav => {
        return (
          <Breadcrumb.Item key={nav.url}>
            <Link to={nav.url}>{nav.name}</Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

BreadNav.propTypes = {
  navs: PropTypes.array.isRequired
};

export default BreadNav;
