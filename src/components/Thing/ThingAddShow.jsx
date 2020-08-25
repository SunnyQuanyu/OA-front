import React from 'react';
import { connect } from 'dva';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ThingAddShow = ({ addThing }) => {

console.log(addThing.tagName)

  return (
    <Typography>
      <Title level={3}>标题：{addThing.title}</Title>
      <Title level={4}>基本信息：</Title>
      <Paragraph>
        <ul>
          <li>标签：{(addThing.tagName||[]).map(item=>{return item}).join('，')}</li>
          {<li>接受小组：{(addThing.teamName||[]).map(item =>{return item}).join('，')}</li>}
          { (
            <li>接收成员：{(addThing.receiverNames||[]).map(item =>{return item.realName}).join('，')}</li>
          )}
          {addThing.startTime !== null && (
            <li>开始时间：{addThing.startTime.format('YYYY-MM-DD HH:mm')}</li>
          )}
          {addThing.endTime !== null && (
            <li>结束时间：{addThing.endTime.format('YYYY-MM-DD HH-mm-ss')}</li>
          )}
          <li>是否需要回执完成？ {addThing.needFinish === '1' ? '是' : '否'}</li>
          {addThing.needFinish === '1' && (
            <li>是否需要回答问题？ {addThing.needAnswer === '1' ? '是' : '否'}</li>
          )}
          {addThing.needFinish === '1' && (
            <li>
              是否需要回复文件？ {addThing.needFileReply === '1' ? '是' : '否'}
            </li>
          )}
          {addThing.hasSendFile === '1' && (
            <li>已选择{addThing.files.length}个文件</li>
          )}
        </ul>
      </Paragraph>
      <Title level={4}>内容：</Title>
      <Paragraph>{addThing.content}</Paragraph>
    </Typography>
  );
};

export default connect(({ addThing }) => ({ addThing }))(ThingAddShow);
