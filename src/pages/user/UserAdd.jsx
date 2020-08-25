/* eslint-disable no-template-curly-in-string */
import React, { useState } from 'react';
import { Button, Upload, message, Table, Space } from 'antd';
import XLSX from 'xlsx';
import http from '../../utils/axios';


const UserAdd = () => {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const props = {
    beforeUpload: file => {
      setFileList([file]);
      // 每次点上传都清零
      setColumns([]);
      setDataSource([]);
      setUploadData([]);
      file.arrayBuffer().then(
        res => {
          let workbook = XLSX.read(res, { type: 'buffer', cellHTML: false, });
          let sheet = workbook.Sheets.Sheet1;
          let tempData = {}; // {1:{A:,B:,}} 指第1行的数据，A列是啥，B列是啥
          let tempColumns = [];
          let tempTableData = [];
          // 解析sheet为tempData
          for (const key in sheet) {
            if (sheet.hasOwnProperty(key) && key !== '!ref' && key !== '!margins') {
              const cell = sheet[key];
              if (!tempData.hasOwnProperty(key.substring(1))) {
                tempData[key.substring(1)] = {};
              }
              tempData[key.substring(1)][key.charAt(0)] = cell.v
            }
          }
          let tempUploadDataList = [];

          // tempData第一行是题头
          for (const key in tempData) {
            if (tempData.hasOwnProperty(key)) {
              const row = tempData[key];
              // 显示的数据整合
              if (key === '1') {
                // 第一行
                for (const key in row) {
                  if (row.hasOwnProperty(key)) {
                    const element = row[key];
                    tempColumns.push({
                      title: element,
                      dataIndex: key,
                      key: key,
                    })
                  }
                }
              } else {
                // 其他行
                tempTableData.push({
                  ...row,
                  key: row['A']
                })
                // 上传的数据整合
                tempUploadDataList.push({
                  number: row.A,
                  realName: row.B,
                  collegeName: row.C,
                  majorName: row.D,
                  className: row.E,
                  identity: row.F
                })
              }
            }
          }
          setColumns(tempColumns);
          setDataSource(tempTableData);
          setUploadData(tempUploadDataList);
          setShowUploadButton(true);
          message.success('处理成功！');
        }
      )
      return false;
    },
    fileList
  };

  const upload = () => {
    http.post('/user/addUsers', uploadData).then(
      res => {
        console.log(res); 
        if (res.data.code===0) {
          message.success('上传成功') 
        } else {
          message.error(res.data.msg)
        }
    }
    ).catch(err => { console.log(err); message.success('上传失败') })
  }

  return (
    <div>
      <div>
        <p>请下载示例文件并再示例文件中添加用户上传</p>
        <p style={{ color: 'red' }}>请勿更改示例文件的第一行内容或扩充列或修改excel表名</p>
        <a href='./示例文件.xlsx' download>点击下载示例文件.xlsx</a>
      </div>
      <Space style={{ margin: '10px 0', alignItems: 'baseline' }}>
        <Upload {...props}>
          <Button>
            点击读取excel文件
        </Button>

        </Upload>
        {
          showUploadButton && <Button onClick={upload} type='primary'>上传</Button>
        }
      </Space>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          showTotal: (total, range) => ` 共 ${total} 条，第 ${range[0]}-${range[1]} 条`
        }}
      />
    </div>
  );
}

export default UserAdd;
