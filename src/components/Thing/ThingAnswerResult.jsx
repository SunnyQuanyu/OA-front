import { Checkbox, Col, Input, Radio, Row } from 'antd';
import React from 'react';
import { replyTypes } from './ThingAddQuestion';

const ThingAnswerResult = ({ questions }) => {
  return (
    <div>
      {questions.map((question, index) => {
        return (
          <div style={{ margin: '1rem' }} key={question.id}>
            <Row>
              <Col span={8}>
                <h5>
                  {index + 1}. {question.title}
                </h5>
              </Col>
              <Col offset={0} span={16}>
                {replyTypes.map((type) => {
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
              </Col>
            </Row>
            <div>
              {question.options !== null &&
                question.options.length !== 0 &&
                (() => {
                  switch (question.replyType) {
                    case '1':
                      return (
                        <Radio.Group disabled>
                          {question.options.map((option) => (
                            <Radio key={option.id} value={option.id}>
                              {option.content} 选择人数：
                              <span style={{ color: 'blue' }}>
                                {option.totalChoose}
                              </span>
                            </Radio>
                          ))}
                        </Radio.Group>
                      );
                    case '2':
                      return (
                        <Checkbox.Group disabled>
                          {question.options.map((option) => (
                            <Checkbox
                              key={option.id}
                              value={option.id.toString()}>
                              {option.content} 选择人数：
                              <span style={{ color: 'blue' }}>
                                {option.totalChoose}
                              </span>
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                      );
                    case '3':
                      return (
                        <div>
                          {question.options.map((option) => (
                            <Row key={option.id} style={{ margin: '2px 0' }}>
                              <Col span={4}>
                                <span>{option.content}：</span>
                              </Col>
                              <Col>
                                <Input size='small' type='number' disabled />
                              </Col>
                            </Row>
                          ))}
                        </div>
                      );
                    case '4':
                      return (
                        <div>
                          {question.options.map((option) => (
                            <Row key={option.id} style={{ margin: '2px 0' }}>
                              <Col span={4}>
                                <span>{option.content}：</span>
                              </Col>
                              <Col span={16}>
                                <Input size='small' disabled />
                              </Col>
                            </Row>
                          ))}
                        </div>
                      );
                    default:
                      break;
                  }
                })()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ThingAnswerResult;
