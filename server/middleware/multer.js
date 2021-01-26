app.use(multer({ dest: ‘./uploads/’,
  rename: function (fieldname, filename) {
    return filename;
  },
}));