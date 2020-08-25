import React, { useEffect, useState } from 'react';
import http from '../../utils/axios';
import ThingFileShow from '../../components/Thing/ThingFileShow';
import ThingAnswer from '../../components/Thing/ThingAnswer';
import { Card, PageHeader } from 'antd';
import BreadNav from '../../components/Frame/BreadNav';

const ThingUserReply = ({ match, history }) => {
  const [thingReceiver, setThingReceiver] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getFinished();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFinished = (params) => {
    setLoading(true);
    http
      .post('/thing/finished/get', match.params)
      .then((res) => {
        if (res.data.code === 0) {
          setLoading(false);
          setThingReceiver(res.data.data.thingReceiver);
          setFiles(res.data.data.files);
          setQuestions(res.data.data.questions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <BreadNav
        navs={[
          { url: '/thing/joinedlist', name: '日程表' },
          {
            url: history.location.pathname,
            name: `${thingReceiver.realName}完成情况`,
          },
        ]}
      />
      <Card loading={loading}>
        <PageHeader
          onBack={() => history.go(-1)}
          style={{ padding: '1rem 0' }}
          title='完成详情'
          subTitle={`${thingReceiver.realName}的回执：`}
        />
        {thingReceiver.content !== undefined &&
        thingReceiver.content !== '' &&
        thingReceiver.content !== null ? (
          <span>回复内容：{thingReceiver.content}</span>
        ) : (
          ''
        )}
        {Array.isArray(files) && files.length > 0 && (
          <ThingFileShow files={files} />
        )}
        {questions !== null && <ThingAnswer questions={questions} />}
      </Card>
    </>
  );
};

export default ThingUserReply;
