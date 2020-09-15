/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Radio,
  Row,
  Col,
  Divider
} from 'antd';
import http from '../utils/axios';
import { userColomns } from '../utils/table-columns';

const UserSearchResult = ({ extraColumns, tableSelectable, getSelectIds,getSelectRows }) => {
  const [form] = Form.useForm();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [queryData, setQueryData] = useState({});
  const [pageData, setPageData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPageData(pageCurrent, pageSize, queryData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const identityOptions = [
    { name: '学生', value: 0 },
    { name: '老师', value: 1 },
    { name: '院长', value: 2 }
  ];
  const columns = [...userColomns, ...extraColumns];

  const getPageData = (current, size, queryData) => {
    setLoading(true);
    http
      .post('/user/getUsers', {
        pageCurrent: current,
        pageSize: size,
        data: queryData
      })
      .then(res => {
        if (res.data.code === 0) {
          setPageData(res.data.data.records);
          setPageTotal(res.data.data.total);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onFinish = values => {
    setPageCurrent(1);
    setPageSize(10);
    setQueryData(values);
    getPageData(1, 10, values);
  };

  const queryList = [
    { name: 'number', label: '学号/工号' },
    { name: 'realName', label: '姓名' },
    { name: 'collegeName', label: '学院' },
    { name: 'majorName', label: '专业' },
    { name: 'className', label: '班级' }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys,selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      getSelectIds(selectedRowKeys);
      getSelectRows(selectedRows);
      console.log(selectedRows)
    }
  };

  return (
    <div>
      <Card>
        <Form
          form={form}
          name='advanced_search'
          onFinish={onFinish}
          className='ant-advanced-search-form'>
          <Row gutter={24}>
            {queryList.map(query => {
              return (
                <Col span={8} key={query.name}>
                  <Form.Item name={query.name} label={query.label}>
                    <Input placeholder={query.label} />
                  </Form.Item>
                </Col>
              );
            })}
            <Col span={8}>
              <Form.Item name='identity' label='身份'>
                <Radio.Group>
                  {identityOptions.map(option => {
                    return (
                      <Radio value={option.value} key={option.value}>
                        {option.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
              style={{
                textAlign: 'right'
              }}>
              <Button 
              //type='primary' 
              htmlType='submit'>
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
      </Card>
      <Card>
        {tableSelectable && (
          <div>
            已选中{' '}
            <span style={{ color: 'blue' }}>{selectedRowKeys.length}</span> 人。
            <Button
              onClick={() => {
                setSelectedRowKeys([]);
                getSelectIds([]);
                getSelectRows({});
              }}
              type='link'
              style={{ float: 'right' }}>
              清除已选
            </Button>
          </div>
        )}
        <Divider />
        <Table
          loading={loading}
          pagination={{
            current: pageCurrent,
            pageSize: pageSize,
            total: pageTotal,
            showTotal: (total, range) =>
              ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
            onChange: (page, size) => {
              setPageCurrent(page);
              getPageData(page, size, queryData);
            },
            onShowSizeChange: (current, size) => {
              setPageCurrent(1);
              setPageSize(size);
              getPageData(current, size, queryData);
            }
          }}
          columns={columns}
          dataSource={pageData}
          rowKey={row => row.id}
          rowSelection={tableSelectable ? rowSelection : null}
        />
      </Card>
    </div>
  );
};

UserSearchResult.propTypes = {
  extraColumns: PropTypes.array,
  tableSelectable: PropTypes.bool,
  getSelectIds: PropTypes.func,
  getSelectRows: PropTypes.func
};

UserSearchResult.defaultProps = {
  extraColumns: [],
  tableSelectable: true
};

export default UserSearchResult;
