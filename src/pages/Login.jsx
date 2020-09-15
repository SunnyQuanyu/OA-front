import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, message, Spin, Checkbox, Modal, Row, Col, Tooltip } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import style from './login.css';
import http from '../utils/axios';
import { getToken, setToken, clearToken } from '../utils/authc';

class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.setState({checked : false});
    this.setState({ifShowModal : false});
  }

  componentDidMount() {
    if(getToken().number != null){
      this.setState({checked : true});
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
          if(this.state.checked){
            setToken(values);
            this.saveUserInfoToDva(res.data.data);
            this.setState({saveNumber : values.number});
          }else{
            clearToken();
          }
         // setToken(values);
         // this.saveUserInfoToDva(res.data.data);
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
      this.setState({checked : e.target.checked});
      console.log(this.state.defaultChecked)
  };

  saveUserInfoToDva = (value) => {
    
        this.props.dispatch({
          type: 'userInfo/save',
          isLogined: true,
          data: value,
        });
    
  };

 handleOk = e => {
  if(this.state.checkCode != this.state.backCheckCode){
    message.warning("验证码输入有误！")
  }else{
    if(this.state.forgetNumber !="" && this.state.newPassWord !=""){
  http
  .post('/user/updatePassWaord', {
    number:this.state.forgetNumber,
    password:this.state.newPassWord
  })
  .then(res => {
    if (res.data.code === 0) {
      message.warning("密码更改成功！")
    }
  })
  .catch(err => {
    console.log(err);
  });
  this.setState({ifShowModal : false})
}else{
  message.warning("学号或密码为空")
}
 }
  };

  sendEmail = () => {
    http
      .post('/user/sendEmail', {
       email: this.state.email
      })
      .then(res => {
        if (res.data.code === 0) {
          message.warning("发送成功！");
          this.setState({backCheckCode : res.data.data})
          
        }
      })
      .catch(err => {
        console.log(err);
      });
      
  };



  layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

   tailLayout = {
    wrapperCol: {
    //  offset: 1,
      span: 16,
    },
  };

  render() {
    return (
    



      <Card title='管理后台登录' className={style.form}>
        <Modal
    destroyOnClose
      title='设置新密码'
      visible={this.state.ifShowModal}
      onOk={this.handleOk}
      onCancel={() => this.setState({ifShowModal : false})}
      >

     <Form
        
        name='advanced_search'        
        className='ant-advanced-search-form'
      //  layout='vertical'
        {...this.layout}
>

       
                <Form.Item name="forgetNumber" label="学号" >
                  <Input 
                //  defaultValue={userInfo.phone}
                  onChange={e => this.setState({forgetNumber : e.target.value})}
                  />
                </Form.Item>
         
                <Form.Item  label="邮箱">
                <Form.Item name="email" noStyle>
                  <Input 
                  style={{ width: 190 }}
                //  defaultValue={userInfo.email}
                  onChange={e => {
                    this.setState({email : e.target.value});
                    console.log(e.target.value);
                }}
                  />
                  
                </Form.Item>

               
                <Button style={{ margin: '0 8px' }}
                onClick={this.sendEmail}
                >发送验证码</Button>
               
                </Form.Item>

                <Form.Item name="checkCode" label="验证码">
                  <Input 
                //  defaultValue={userInfo.email}
                  onChange={e => this.setState({checkCode : e.target.value})}
                  />
                </Form.Item>

                <Form.Item name="newPassWord" label="新密码">
                  <Input.Password 
                //  defaultValue={userInfo.email}
                  onChange={e => this.setState({newPassWord : e.target.value})}
                  />
                </Form.Item>
          
      </Form>
    </Modal>
        <Spin spinning={this.state.loading}>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{ 
              remember: true , 
              number: getToken().number,
              password: getToken().password}}
            onFinish={this.onFinish}>
            <Form.Item
              name='number'
              rules={[{ required: true, message: '请输入学号/工号!' }]}>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
              //  defaultValue={getToken().number}
                placeholder='学号/工号'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: '请输入密码!' }]}>
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
              //  defaultValue={getToken().password}
                placeholder='密码'
              />
            </Form.Item>
            <Form.Item>
            <Checkbox 
            checked={this.state.checked}
            onChange={this.onChange}
            indeterminate={false}
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
