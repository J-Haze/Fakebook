import React, { useRef } from "react";

const FileUploader = (props) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    // handle validations
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("File size cannot exceed more than 5MB");
        props.onFileSelectError({
          error: "File size cannot exceed more than 5MB"
        });
      }
      else props.onFileSelectSuccess(file);
    } else {
      // document.getElementsByClassName("file-uploader")
      // document.getElementById("create-post-form-img-upload").reset();
      // document.getElementByClassName("file-uploader").reset();
      props.setImgUpload(null)
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
