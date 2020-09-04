import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, message, Spin, Checkbox, Modal, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import style from './login.css';
import http from '../utils/axios';
import { getToken, setToken } from '../utils/authc';

class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.setState({checked : false});
    this.setState({ifShowModal : false});
  }

  componentDidMount() {
    let token = getToken();
    if (token) {
      this.login(token);
    }
  }

  getParams = (key) => {
    let paramStrs = this.props.location.search.substr(1).split('&');
    let params = {};
    paramStrs.forEach(
      (paramStr) => (params[paramStr.split('=')[0]] = paramStr.split('=')[1])
    );
    return params[key];
  };

  login = (values) => {
    this.setState({ loading: true });
    http
      .post('/user/login', values)
      .then((res) => {
        if (res.data.code === 0) {
          message.success('登录成功');
          setToken(values);
          this.saveUserInfoToDva(res.data.data);
          if (this.getParams('state') === 'bind') {
            this.props.history.push(`/u/wxbind${this.props.location.search}`);
          } else {
            this.props.history.push('/u/info');
          }
        } else {
          this.setState({ loading: true });
          message.error(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: true });
        message.error('未知错误');
      });
  };

  onFinish = (values) => {
    this.login(values);
  };
  onChange = e => {
     console.log(`checked = ${e.target.checked}`);
    //  checked = e.target.checked;
      this.setState({checked : e.target.checked})
  };

  saveUserInfoToDva = (value) => {
    if(this.state.checked == true){
        this.props.dispatch({
          type: 'userInfo/save',
          isLogined: true,
          data: value,
        });
    }
  };

 handleOk = e => {
    http
      .post('/user/update', {
      //  id: userInfo.id,
      //  phone:updateUserPhone==""?userInfo.phone:updateUserPhone,
      //  email:updateUserEmail==""?userInfo.email:updateUserEmail
      })
      .then(res => {
        if (res.data.code === 0) {
          message.warning("发送成功！")
        }
      })
      .catch(err => {
        console.log(err);
      });
      this.setState({ifShowModal : false})
  };

  render() {
    return (
    



      <Card title='管理后台登录' className={style.form}>
        <Modal
    destroyOnClose
      title='发送邮件'
      okText='发送'
      visible={this.state.ifShowModal}
      onOk={this.handleOk}
      onCancel={() => this.setState({ifShowModal : false})}
      >

     <Form
        
        name='advanced_search'        
        className='ant-advanced-search-form'
>

        <Row gutter={24}>
              <Col span={20}>
                <Form.Item name="number" label="学号">
                  <Input 
                //  defaultValue={userInfo.phone}
                //  onChange={e => setUpdateUserPhone(e.target.value)}
                  />
                </Form.Item>
              </Col>
       </Row>
       <Row gutter={24}>
              <Col span={20}>
                <Form.Item name="email" label="邮箱">
                  <Input 
                //  defaultValue={userInfo.email}
                 // onChange={e => setUpdateUserEmail(e.target.value)}
                  />
                </Form.Item>
              </Col>
       </Row>
      </Form>
    </Modal>
        <Spin spinning={this.state.loading}>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{ remember: true }}
            onFinish={this.onFinish}>
            <Form.Item
              name='number'
              rules={[{ required: true, message: '请输入学号/工号!' }]}>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='学号/工号'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: '请输入密码!' }]}>
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='密码'
              />
            </Form.Item>
            <Form.Item>
            <Checkbox 
            onChange={this.onChange}
            >
            记住密码
            </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'>
                登录
              </Button>
              <Button
                    type='link'
                    onClick={() => {
                      this.setState({ifShowModal : true});
                    }}
              >
                忘记密码
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      
    );
  }
}

export default connect(({ userInfo }) => ({ userInfo }))(Login);
