app.use(multer({ dest: ‘./uploads/’,
  rename: function (fieldname, filename) {
    return filename;
  },
}));

// import multer from ‘multer’;
// const storage = multer.memoryStorage();
// const multerUploads = multer({ storage }).single(‘image’);
// export { multerUploads };