module.exports = function(app) {

  app.dataSources.mysql.automigrate('Order', function(err) {
    if (err) throw err;
  });

  app.dataSources.mysql.automigrate('Address', function(err) {
    if (err) throw err;
  });
};
