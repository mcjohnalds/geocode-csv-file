import React from 'react';

let FileInput = ({...props}) => (
  <label className="col m-2 custom-file">
    <input type="file" className="custom-file-input" {...props}/>
    <span className="custom-file-control" />
  </label>
);

export default FileInput;
