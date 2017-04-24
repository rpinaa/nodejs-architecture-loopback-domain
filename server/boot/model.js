module.exports = (app) => {

  app.dataSources.db.automigrate('User', (err) => {
    if (err) throw err;
  });

  app.dataSources.db.automigrate('AccessToken', (err) => {
    if (err) throw err;
  });

  app.dataSources.db.automigrate('ACL', (err) => {
    if (err) throw err;
  });

  app.dataSources.db.automigrate('RoleMapping', (err) => {
    if (err) throw err;
  });

  app.dataSources.db.automigrate('OrderEntity', (err) => {
    if (err) throw err;
  });

  app.dataSources.db.automigrate('AddressEntity', (err) => {
    if (err) throw err;
  });
};
