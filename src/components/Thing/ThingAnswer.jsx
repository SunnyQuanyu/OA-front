import { Checkbox, Col, Input, Radio, Row } from 'antd';
import React from 'react';
import { replyTypes } from './ThingAddQuestion';

const ThingAnswer = ({ questions }) => {
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
              {question.answers !== null &&
                question.answers.length !== 0 &&
                (() => {
                  switch (question.replyType) {
                    case '1':
                      return (
                        <Radio disabled>
                          {question.answers[0].option.content}
                        </Radio>
                      );
                    case '2':
                      return (
                        <>
                          {question.answers.map((answer) => (
                            <Checkbox disabled key={answer.id}>
                              {answer.option.content}
                            </Checkbox>
                          ))}
                        </>
                      );
                    case '3':
                      return (
                        <>
                          {question.answers.map((answer) => (
                            <Row key={answer.id} style={{ margin: '2px 0' }}>
                              <Col span={4}>
                                <span>{answer.option.content}：</span>
                              </Col>
                              <Col>
                                <Input
                                  disabled
                                  placeholder={answer.score}
                                  size='small'
                                  type='number'
                                />
                              </Col>
                            </Row>
                          ))}
                        </>
                      );
                    case '4':
                      return (
                        <div>
                          {question.answers.map((answer) => (
                            <Row key={answer.id} style={{ margin: '2px 0' }}>
                              <Col span={4}>
                                <span>{answer.option.content}：</span>
                              </Col>
                              <Col span={16}>
                                <Input
                                  disabled
                                  placeholder={answer.inputText}
                                  size='small'
                                />
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

export default ThingAnswer;
