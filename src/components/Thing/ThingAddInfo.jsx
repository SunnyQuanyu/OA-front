import React from 'react';
import { connect } from 'dva';
import { Input, Radio, Row, Col, DatePicker, Upload, Button } from 'antd';
import style from './thing.css';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ThingAddInfo = ({ addThing, saveThingChange }) => {
  // const saveThingChange = (value, key) => {
  //   dispatch({
  //     type: 'addThing/save',
  //     payload: {
  //       [key]: value
  //     }
  //   });
  // };

  const handleAnswerRadio = value => {
    saveThingChange(value, 'needAnswer');
    if (value === '1') {
      saveThingChange([1, 2, 3, 4, 5], 'showStepKeys');
    } else {
      saveThingChange([1, 2, 3, 5], 'showStepKeys');
    }
  };

  const fileUploadProps = {
    onRemove: file => {
      const index = addThing.files.indexOf(file);
      const newFileList = addThing.files.slice();
      newFileList.splice(index, 1);
      saveThingChange(newFileList, 'files');
    },
    beforeUpload: file => {
      saveThingChange([...addThing.files, file], 'files');
      return false;
    },
    fileList: addThing.files
  };

  return (
    <div>
      <Row className={style.infoRow}>
        <Col span={8}>
          <span className={`${style.boldFont} ${style.require}`}>题目:</span>
        </Col>
        <Col span={16}>
          <Input
            value={addThing.title}
            onChange={e => {
              saveThingChange(e.target.value, 'title');
            }}
          />
        </Col>
      </Row>
      <Row className={style.infoRow}>
        <Col span={8} className={`${style.boldFont} ${style.require}`}>
          是否发送附件？
        </Col>
        <Radio.Group
          onChange={e => {
            saveThingChange(e.target.value, 'hasSendFile');
          }}
          value={addThing.hasSendFile}>
          <Radio value='0'>否</Radio>
          <Radio value='1'>是</Radio>
        </Radio.Group>
      </Row>
      <Row className={style.infoRow}>
        <Col span={8} className={`${style.boldFont} ${style.require}`}>
          是否需要回执完成？
        </Col>
        <Radio.Group
          onChange={e => {
            saveThingChange(e.target.value, 'needFinish');
          }}
          value={addThing.needFinish}>
          <Radio value='0'>否</Radio>
          <Radio value='1'>是</Radio>
        </Radio.Group>
      </Row>
      {addThing.needFinish === '1' && (
        <div>
          <Row className={style.infoRow}>
            <Col span={8} className={`${style.boldFont} ${style.require}`}>
              是否需要填写问答？
            </Col>
            <Radio.Group
              onChange={e => {
                handleAnswerRadio(e.target.value);
              }}
              value={addThing.needAnswer}>
              <Radio value='0'>否</Radio>
              <Radio value='1'>是</Radio>
            </Radio.Group>
          </Row>
          <Row className={style.infoRow}>
            <Col span={8} className={`${style.boldFont} ${style.require}`}>
              是否需要回复附件？
            </Col>
            <Radio.Group
              onChange={e => {
                saveThingChange(e.target.value, 'needFileReply');
              }}
              value={addThing.needFileReply}>
              <Radio value='0'>否</Radio>
              <Radio value='1'>是</Radio>
            </Radio.Group>
          </Row>
        </div>
      )}
      <Row className={style.infoRow}>
        <Col span={8} className={style.boldFont}>
          开始时间：
        </Col>
        <DatePicker
          showTime
          onChange={value => {
            saveThingChange(value, 'startTime');
          }}
          value={addThing.startTime}
        />
      </Row>
      <Row className={style.infoRow}>
        <Col span={8} className={style.boldFont}>
          截止时间：
        </Col>
        <DatePicker
          showTime
          onChange={value => {
            saveThingChange(value, 'endTime');
          }}
          value={addThing.endTime}
        />
      </Row>
      {addThing.hasSendFile === '1' && (
        <Row className={style.infoRow}>
          <Col span={8} className={`${style.boldFont} ${style.require}`}>
            选择文件：
          </Col>
          <Upload {...fileUploadProps}>
            <Button>
              <UploadOutlined />
              点击上传(多次点击可以上传多个)
            </Button>
          </Upload>
        </Row>
      )}
      <Row className={style.infoRow}>
        <Col span={8} className={`${style.boldFont} ${style.require}`}>
          事务内容：
        </Col>
        <TextArea
          style={{ margin: '8px 0' }}
          rows={10}
          onChange={e => {
            saveThingChange(e.target.value, 'content');
          }}
          value={addThing.content}
        />
      </Row>
    </div>
  );
};

export default connect(({ addThing }) => ({ addThing }))(ThingAddInfo);
