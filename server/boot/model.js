module.exports = function(app) {

  app.dataSources.mysql.automigrate('OrderEntity', function(err) {
    if (err) throw err;
  });

  app.dataSources.mysql.automigrate('AddressEntity', function(err) {
    if (err) throw err;
  });
};
