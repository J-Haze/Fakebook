import React, { useRef } from "react";

const FileUploader = (props) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    // handle validations
    let file = e.target.files[0];
    if (file) {
      props.onFileSelectSuccess(file);
    } else {
      props.setImgUpload(null);
    }
  };

  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileInput} />
      <button
        onClick={(e) => fileInput.current && fileInput.current.click()}
        className="hide"
      ></button>
    </div>
  );
};

export default FileUploader;
