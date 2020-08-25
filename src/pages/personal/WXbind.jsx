import { message, Spin } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import http from '../../utils/axios';

class WXbind extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.bind();
  }

  getCode = () => {
    let paramStrs = this.props.location.search.substr(1).split('&');
    let params = {};
    paramStrs.forEach(
      (paramStr) => (params[paramStr.split('=')[0]] = paramStr.split('=')[1])
    );
    console.log('parms', params);
    return params['code'];
  };

  bind = () => {
    http
      .post(`/user/bindWX?code=${this.getCode()}`)
      .then((res) => {
        if (res.data.code === 0) {
          message.success('绑定成功');
          this.saveUserInfoToDva(res.data.data);
          this.props.history.push('/u/info');
        } else {
          message.error(res.data.msg);
          this.props.history.push('/u/info');
        }
      })
      .catch((err) => {
        console.log(err);
        message.error('未知错误');
        this.props.history.push('/u/info');
      });
  };

  saveUserInfoToDva = (value) => {
    this.props.dispatch({
      type: 'userInfo/save',
      isLogined: true,
      data: value,
    });
  };

  render() {
    return <Spin size='large' />;
  }
}

export default connect(({ userInfo }) => ({ userInfo }))(WXbind);
