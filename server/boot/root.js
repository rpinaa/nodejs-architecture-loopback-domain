module.exports = server => {
  const router = server.loopback.Router();

  router.get(['/', '/_ah/health'],
    (request, response) => response.send({'status': 'UP'}));

  server.use(router);
};
