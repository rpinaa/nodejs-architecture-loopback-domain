module.exports = function(app) {

  app.dataSources.db.automigrate('OrderEntity', function(err) {
    if (err) throw err;
  });

  app.dataSources.db.automigrate('AddressEntity', function(err) {
    if (err) throw err;
  });
};
