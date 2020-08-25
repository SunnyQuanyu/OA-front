import { Button, Col, Form, Radio, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const ThingSearchForm = ({ form, onFinish, needFinish }) => {
  const ynOptions = [
    {
      name: '否',
      value: '0'
    },
    {
      name: '是',
      value: '1'
    }
  ];
  const queryCommonRadios = [{ name: 'hasRead', label: '是否阅读？' }];
  const queryRadios = needFinish
    ? [...queryCommonRadios, { name: 'hasFinished', label: '是否完成？' }]
    : queryCommonRadios;

  return (
    <Form
      form={form}
      name='advanced_search'
      onFinish={onFinish}
      className='ant-advanced-search-form'>
      <Row gutter={24}>
        {queryRadios.map(radio => {
          return (
            <Col key={radio.name} span={8}>
              <Form.Item name={radio.name} label={radio.label}>
                <Radio.Group>
                  {ynOptions.map(option => {
                    return (
                      <Radio value={option.value} key={option.value}>
                        {option.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right'
          }}>
          <Button type='primary' htmlType='submit'>
            查询
          </Button>
          <Button
            style={{ margin: '0 8px' }}
            onClick={() => {
              form.resetFields();
            }}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

ThingSearchForm.propTypes = {
  form: PropTypes.any,
  onFinish: PropTypes.func,
  needFinish: PropTypes.bool
};

ThingSearchForm.defaultProps = {
  needFinish: true
};

export default ThingSearchForm;
