import React from 'react';
import { Result, Button } from 'antd';

const PageNotFound = (props) => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='页面压根就没有.'
      extra={
        <Button
          type='primary'
          onClick={() => props.history.push('/thing/joinedlist')}>
          返回主页
        </Button>
      }
    />
  );
};

export default PageNotFound;
