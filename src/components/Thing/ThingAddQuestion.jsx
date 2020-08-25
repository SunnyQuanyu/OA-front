import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row
} from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import style from './thing.css';

export const replyTypes = [
  {
    value: '1',
    des: '单选'
  },
  {
    value: '2',
    des: '多选'
  },
  {
    value: '3',
    des: '数字填空'
  },
  {
    value: '4',
    des: '常规填空'
  }
];

const QuestionModal = ({ visible, onOk, onCancel }) => {
  const [title, setTitle] = useState('');
  const [replyType, setReplyType] = useState(1);
  const [maxChoose, setMaxChoose] = useState(null);

  const init = () => {
    setTitle('');
    setReplyType(1);
    setMaxChoose(null);
  };

  return (
    <Modal
      title='添加问题'
      visible={visible}
      onOk={() => {
        if (onOk({ title, replyType, maxChoose })) {
          init();
        }
      }}
      onCancel={onCancel}>
      <Row style={{ margin: '0 0 1rem 0' }}>
        <Col span={4}>
          <h5 className={style.require}>题目：</h5>
        </Col>
        <Col span={20}>
          <Input
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={4}>
          <h5 className={style.require}>类型：</h5>
        </Col>
        <Col>
          <Radio.Group
            value={replyType}
            onChange={e => {
              setMaxChoose(null);
              setReplyType(e.target.value);
            }}>
            {replyTypes.map(replyType => {
              return (
                <Radio key={replyType.value} value={replyType.value}>
                  {replyType.des}
                </Radio>
              );
            })}
          </Radio.Group>
        </Col>
      </Row>
      {replyType === '2' && (
        <Row>
          <Col span={8}>
            <h5 className={style.require}>最大多选个数：</h5>
          </Col>
          <Col>
            <Input
              type='number'
              value={maxChoose}
              onChange={e => {
                setMaxChoose(e.target.value);
              }}
            />
          </Col>
        </Row>
      )}
    </Modal>
  );
};

const OptionModal = ({ visible, onOk, onCancel, question }) => {
  const [content, setContent] = useState('');
  const init = () => {
    setContent('');
  };

  return (
    <Modal
      title={`为${question ? question.title : ''}添加选项`}
      visible={visible}
      onOk={() => {
        if (onOk({ content })) {
          init();
        }
      }}
      onCancel={onCancel}>
      <Row style={{ margin: '0 0 1rem 0' }}>
        <Col span={4}>
          <h5>内容：</h5>
        </Col>
        <Col span={20}>
          <Input
            value={content}
            onChange={e => {
              setContent(e.target.value);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

const ThingAddQuestion = ({ addThing, saveThingChange }) => {
  const [questModalVisible, setQuestionModalVisible] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);

  const handleCreateQuestionOk = value => {
    if (value.title === '') {
      message.warn('请输入问题题目');
      return false;
    } else if (value.replyType === '2' && value.maxChoose === null) {
      message.warn('请输入最大多选个数');
      return false;
    }
    saveThingChange([...addThing.questions, value], 'questions');
    setQuestionModalVisible(false);
    message.success('添加成功');
    return true;
  };

  const handleAddOption = value => {
    if (value.content === '') {
      message.warn('请输入选项');
      return false;
    }
    let tempQuestions = addThing.questions;
    const tempOptions = tempQuestions[addThing.currentIndex].options;
    tempQuestions[addThing.currentIndex].options =
      tempOptions === undefined
        ? [value]
        : [...tempQuestions[addThing.currentIndex].options, value];
    saveThingChange(tempQuestions, 'question');
    message.success('添加成功');
    setOptionModalVisible(false);

    return true;
  };

  const handleDelQuestion = index => {
    let tempQuestions = addThing.questions;
    saveThingChange(tempQuestions.splice(index, 1), 'question');
    message.info('删除成功');
  };

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setQuestionModalVisible(true);
        }}>
        添加题目
      </Button>
      <Divider />
      <QuestionModal
        visible={questModalVisible}
        onOk={handleCreateQuestionOk}
        onCancel={() => {
          setQuestionModalVisible(false);
        }}
      />
      <OptionModal
        question={addThing.questions[addThing.currentIndex]}
        visible={optionModalVisible}
        onOk={handleAddOption}
        onCancel={() => {
          setOptionModalVisible(false);
        }}
      />
      {addThing.questions.map((question, index) => {
        return (
          <div style={{ margin: '1rem' }} key={question.title}>
            <Row>
              <Col span={8}>
                <h3>
                  {index + 1}. {question.title}
                </h3>
              </Col>
              <Col offset={0} span={16}>
                {replyTypes.map(type => {
                  if (type.value === question.replyType) {
                    if (question.replyType === '2') {
                      return (
                        <span
                          key={
                            type.value
                          }>{`${type.des} 最多选${question.maxChoose}项`}</span>
                      );
                    }
                    return <span key={type.value}>{type.des}</span>;
                  }
                  return '';
                })}
                <Popconfirm
                  title='确定删除？'
                  onConfirm={() => {
                    handleDelQuestion(index);
                  }}>
                  <Button
                    style={{ float: 'right', margin: '0 10px' }}
                    size='small'
                    danger>
                    删除
                  </Button>
                </Popconfirm>
                <Button
                  style={{ float: 'right' }}
                  size='small'
                  type='primary'
                  onClick={() => {
                    saveThingChange(index, 'currentIndex');
                    setOptionModalVisible(true);
                  }}>
                  {question.replyType === '1' || question.replyType === '2'
                    ? '添加选项'
                    : '添加子问题'}
                </Button>
              </Col>
            </Row>
            <div>
              {question.options !== undefined &&
                question.options.map(option => {
                  switch (question.replyType) {
                    case '1':
                      return (
                        <Radio disabled key={option.content}>
                          {option.content}
                        </Radio>
                      );
                    case '2':
                      return (
                        <Checkbox disabled key={option.content}>
                          {option.content}
                        </Checkbox>
                      );
                    case '3':
                      return (
                        <Row key={option.content}>
                          <Col span={4}>
                            <h5>{option.content}：</h5>
                          </Col>
                          <Col span={8}>
                            <Input disabled size='small' />
                          </Col>
                        </Row>
                      );
                    case '4':
                      return (
                        <Row key={option.content}>
                          <Col span={4}>
                            <h5>{option.content}：</h5>
                          </Col>
                          <Col span={8}>
                            <Input disabled size='small' />
                          </Col>
                        </Row>
                      );
                    default:
                      return '';
                  }
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default connect(({ addThing }) => ({ addThing }))(ThingAddQuestion);
