import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const EditorComponent = (props) => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  return (
    <Editor
      initialValue={props.initialValue}
      apiKey={API_KEY}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor |alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={props.handleEditorChange}
    />
  );
};

export default EditorComponent;
