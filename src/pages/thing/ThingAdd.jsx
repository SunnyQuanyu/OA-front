import React, { useState, useEffect } from 'react';
import { Steps, Button, Card, message } from 'antd';
import { connect } from 'dva';
import ThingAddInfo from '../../components/Thing/ThingAddInfo';
import ThingAddTag from '../../components/Thing/ThingAddTag';
import ThingAddUsers from '../../components/Thing/ThingAddUsers';
import ThingAddShow from '../../components/Thing/ThingAddShow';
import http from '../../utils/axios';
import BreadNav from '../../components/Frame/BreadNav';
import ThingAddQuestion from '../../components/Thing/ThingAddQuestion';

const { Step } = Steps;

const ThingAdd = ({ addThing, dispatch, history }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    dispatch({
      type: 'addThing/init',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveThingChange = (value, key) => {
    console.log(key,value)
    dispatch({
      type: 'addThing/save',
      payload: {
        [key]: value,
      },
    });
  };

  const steps = [
    {
      key: 1,
      title: '填写基本信息',
      content: <ThingAddInfo saveThingChange={saveThingChange} />,
    },
    {
      key: 2,
      title: '选择标签',
      content: <ThingAddTag saveThingChange={saveThingChange} />,
    },
    {
      key: 3,
      title: '选择接收小组/人',
      content: <ThingAddUsers saveThingChange={saveThingChange} />,
    },
    {
      key: 4,
      title: '创建问答',
      content: <ThingAddQuestion saveThingChange={saveThingChange} />,
    },
    {
      key: 5,
      title: '发布事务',
      content: <ThingAddShow />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onChange = (cur) => {
    setCurrent(cur);
  };

  const validThing = () => {
    const data = addThing;
    if (data.title === '') {
      message.error('请输入标题！');
      return false;
    } else if (data.content === '') {
      message.error('请输入内容！');
      return false;
    } else if (data.tagId === null) {
      message.error('请选择标签！');
      return false;
    } else if (data.teamId === null && data.receiverIds.length === 0) {
        message.error('请选择小组或接收者！');
        return false;
    }  else if (data.needAnswer === '1' && data.questions.length === 0) {
      message.error('请添加问题！');
      return false;
    }
    return true;
  };

  const handleAddThing = () => {
    if (validThing()) {
      let formData = new FormData();
      formData.append('title', addThing.title);
      formData.append('content', addThing.content);
      formData.append('hasSendFile', addThing.hasSendFile);
      formData.append('needFinish', addThing.needFinish);
      formData.append('needAnswer', addThing.needAnswer);
      formData.append('needFileReply', addThing.needFileReply);
      if (addThing.startTime !== null) {
        formData.append('startTime', addThing.startTime._d);
      }
      if (addThing.endTime !== null) {
        formData.append('endTime', addThing.endTime._d);
      }
      formData.append('tagId', addThing.tagId);
    //  formData.append('userTeam', addThing.userTeam);
      formData.append('teamId', addThing.teamId);
     formData.append('receiverIds', addThing.receiverIds);
      
      if (addThing.files.length !== 0) {
        addThing.files.forEach((file) => {
          formData.append('files', file);
        });
      }
      formData.append('questionsJSON', JSON.stringify(addThing.questions));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      http
        .post('/thing', formData, config)
        .then((res) => {
          if (res.data.code === 0) {
            setCurrent(0);
            dispatch({ type: 'addThing/init' });
            message.success('发布成功！');
            history.push('/thing/createdlist');
          } else {
            message.error(res.data.msg);
          }
        })
        .catch((err) => {
          message.error('服务器开小差了');
          console.log(err);
        });
    }
  };

  return (
    <div>
      <BreadNav navs={[{ url: '/thing/edit', name: '创建事务' }]} />
      <Card>
        <Steps current={current} onChange={onChange}>
          {steps
            .filter((step) =>
              addThing.showStepKeys.indexOf(step.key) === -1 ? false : true
            )
            .map((item) => (
              <Step key={item.key} title={item.title} />
            ))}
        </Steps>
      </Card>
      <Card>
        {/* {steps.filter(step =>
          addThing.showStepKeys.indexOf(step.key) === -1 ? false : true
        )[current].content} */}
        {
          steps.filter((step) =>
            addThing.showStepKeys.indexOf(step.key) === -1 ? false : true
          )[current].content
        }
        <div style={{ margin: '10px 0 0 0' }}>
          {current < addThing.showStepKeys.length - 1 && (
            <Button type='primary' onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === addThing.showStepKeys.length - 1 && (
            <Button type='primary' onClick={() => handleAddThing()}>
              确定发布
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: 8 }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default connect(({ addThing }) => ({ addThing }))(ThingAdd);
