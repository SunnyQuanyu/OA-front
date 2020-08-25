import { Button, Card, Form, Input, message, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import http from '../../utils/axios';

const TagCreateCommon = ({ isPublic, history }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAvalibleTags();
  }, []);

  const getAvalibleTags = () => {
    http
      .post('/tag/tags')
      .then((res) => {
        if (res.data.code === 0) {
          setTags(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (values) => {
    addTag({ ...values, publicState: isPublic ? '1' : '0' });
  };

  const addTag = (option) => {
    http
      .post('/tag', option)
      .then((res) => {
        if (res.data.code === 0) {
          message.success('添加成功！');
          history.push('/tag/list');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tip = isPublic ? (
    <h5 style={{ color: 'red' }}>正在创建共有标签：创建后所有用户均可使用</h5>
  ) : (
    <h5 style={{ color: 'blue' }}>
      正在创建私有标签：创建后只有自己能够使用,其他用户不会看见
    </h5>
  );

  return (
    <>
      <Card>
        {tip}
        <Form name='addtag' onFinish={onFinish}>
          <Form.Item
            label='父级标签'
            name='parentId'
            rules={[{ required: true, message: '请选择父级标签！' }]}>
            <TreeSelect
              placeholder='请选择父级标签'
              treeDefaultExpandAll
              treeData={tags}
            />
          </Form.Item>

          <Form.Item
            label='标签名'
            name='tagName'
            rules={[{ required: true, message: '请输入标签名！' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

TagCreateCommon.propTypes = {
  isPublic: PropTypes.bool.isRequired,
};

export default TagCreateCommon;
