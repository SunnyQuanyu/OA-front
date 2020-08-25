import React from 'react';
import PropTypes from 'prop-types';

const ThingFileShow = ({ files }) => {
  return (
    <div>
      <div style={{ color: 'red' }}>共 {files.length} 附件:点击下载</div>
      {files.map(file => (
        <div key={file.fileUrl}>
          <a
            href={file.fileUrl}
            download={file.originName}
            target='_blank'
            rel='noopener noreferrer'>
            {file.originName}
          </a>
        </div>
      ))}
    </div>
  );
};
ThingFileShow.propTypes = {
  files: PropTypes.array.isRequired
};

export default ThingFileShow;
