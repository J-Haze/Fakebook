const { createProxyMiddleware } = require("http-proxy-middleware");

// //Dev:
// module.exports = function (app) {
//     app.use(
//         '/api',
//         createProxyMiddleware({
//             target: 'http://localhost:5000',
//             changeOrigin: true,
//         })
//     );
// };

//Prod:
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://justins-fakebook.herokuapp.com",
      changeOrigin: true,
    })
  );
};
