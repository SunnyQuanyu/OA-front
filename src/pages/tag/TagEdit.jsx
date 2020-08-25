import React from 'react';
import BreadNav from '../../components/Frame/BreadNav';
import TagCreateCommon from './TagCreateCommon';

const TagEdit = (props) => {
  return (
    <div>
      <BreadNav
        navs={[
          { url: '/tag/list', name: '可用标签' },
          { url: '/tag/editpub', name: '创建私有标签' },
        ]}
      />
      <TagCreateCommon isPublic={false} {...props} />
    </div>
  );
};

export default TagEdit;
