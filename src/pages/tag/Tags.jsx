import React, { useEffect, useState } from 'react';
import http from '../../utils/axios';
import { Tree, Card, Button, Divider, Modal, Input, message } from 'antd';
import BreadNav from '../../components/Frame/BreadNav';

const getAvalibleTags = () => {
  return http.post('/tag/tags');
};

const getCreatedTag = () => {
  return http.post('/tag/createdTags');
};

const Tags = props => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [myTags, setMyTags] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTagName, setUpdateTagName] = useState('');
  const [modalTitle, setModalTitle] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllData = () => {
    setLoading(true);
    Promise.all([getAvalibleTags(), getCreatedTag()])
      .then(res => {
        if (res[0].data.code === 0 && res[1].data.code === 0) {
          setLoading(false);
          const avaTags = res[0].data.data;
          const creTags = res[1].data.data;
          const creTagIDs = creTags.map(tag => tag.id);
          let myTags = JSON.parse(JSON.stringify(avaTags));
          myTags.forEach(tag => {
            handleMyTagsTree(tag, creTagIDs);
          });
          setTags(avaTags);
          setMyTags(myTags);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const privateTagStyle = { color: 'red' };
  const myTagStyle = { color: 'green' };

  const handleMyTagsTree = (node, creTagIDs) => {
    if (creTagIDs.indexOf(node.key) === -1) {
      node.disabled = true;
    } else {
      node.title = (
        <span
          style={
            node.publicState
              ? myTagStyle
              : { ...privateTagStyle, ...privateTagStyle }
          }>
          {node.title}
        </span>
      );
    }
    if (
      node.children === null ||
      node.children === undefined ||
      node.children.length === 0
    ) {
      return;
    }
    node.children.forEach(child => {
      handleMyTagsTree(child, creTagIDs);
    });
  };

  const handleOnSelectTag = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
    setModalTitle(info.node.title);
    setShowUpdateModal(true);
  };

  const handleUpdateTag = () => {
    if (updateTagName === '') {
      message.warn('请输入新的标签名');
      return;
    }
    http
      .post('/tag/update', {
        id: selectedKeys[0],
        tagName: updateTagName
      })
      .then(res => {
        if (res.data.code === 0) {
          message.success('修改成功！');
          getAllData();
          setUpdateTagName('');
          setSelectedKeys([]);
          setShowUpdateModal(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <BreadNav navs={[{ url: '/tag/list', name: '可用标签' }]} />
      <Card
        loading={loading}
        title='我的标签：'
        extra={
          <Button
            onClick={() => {
              props.history.push(`/tag/edit`);
            }}
            type='primary'>
            新建私有标签
          </Button>
        }>
        <h4>可选标签：</h4>
        {tags.length !== 0 && <Tree treeData={tags} selectable={false} />}
        <Divider />
        <h4>
          我创建的标签：(<span style={{ color: 'green' }}>共有标签</span>，
          <span style={{ color: 'red' }}>私有标签</span>)
        </h4>
        <span style={{ color: 'blue' }}>点击标签重命名</span>
        {myTags.length !== 0 && (
          <Tree
            defaultExpandAll
            treeData={myTags}
            onSelect={handleOnSelectTag}
            selectedKeys={selectedKeys}
          />
        )}
      </Card>
      <Modal
        title='修改标签名'
        visible={showUpdateModal}
        onCancel={() => {
          setShowUpdateModal(false);
          setSelectedKeys([]);
        }}
        onOk={handleUpdateTag}>
        <span>原名：</span>
        {modalTitle}
        <Input
          value={updateTagName}
          onChange={e => setUpdateTagName(e.target.value)}
          placeholder='请输入新的标签名'
        />
      </Modal>
    </div>
  );
};

export default Tags;
