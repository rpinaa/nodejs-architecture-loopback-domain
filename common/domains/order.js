'use strict';

const async = require('async');

const AddressEntity = require('loopback').getModel('AddressEntity');
const OrderEntity = require('loopback').getModel('OrderEntity');

module.exports = (Order) => {

  /*
   * Business constraints
   * */

  Order.validatesLengthOf('name', {min: 3, max: 15});
  Order.validatesFormatOf('id', {with: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/});
  Order.validatesFormatOf('latitude', {with: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/});
  Order.validatesFormatOf('longitude', {with: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/});

  /*
   * Business methods
   * */

  Order.createOrder = (order, cb) => {

    async.waterfall([
      (callback) => {

        OrderEntity.findById(order.id, {include: 'address'}, (err, orderEntity) => {
          err ? callback(err) : callback(null, orderEntity);
        });
      },
      (orderEntity, callback) => {

        if (orderEntity) {
          return callback(null, orderEntity);
        }

        OrderEntity.beginTransaction('READ COMMITTED', (err, tx) => {
          const addressEntity = new AddressEntity(order.address);

          AddressEntity.create(addressEntity, {transaction: tx}, (err, addressEntity) => {
            const orderEntity = new OrderEntity(order);

            orderEntity.address(addressEntity);

            OrderEntity.create(orderEntity, {transaction: tx}, (err, orderEntity) => tx.commit((err) => {
              const order = new Order(orderEntity);

              order.address = addressEntity;

              cb(err, order);
            }));
          });
        });
      }
    ], cb);
  };

  Order.findOrderById = (idOrder, cb) => OrderEntity.findById(idOrder, {include: 'address'}, cb);

  Order.findOrders = (filters, cb) => {
    const query = filters && JSON.parse(filters);

    Object.assign({include: 'address', limit: 10}, query);

    OrderEntity.find(query, cb);
  };

  /*
   * Hooks API methods
   * */

  Order.beforeRemote('createOrder', (ctx, model, next) => {
    const order = new Order(ctx.req.body);

    if (order) {
      order.isValid((valid) => valid ? next() : next(order.errors));
    }
  });

  /*
   * Remote API methods
   * */

  Order.disableRemoteMethodByName('prototype.__create__orderAddress');
  Order.disableRemoteMethodByName('prototype.__update__orderAddress');
  Order.disableRemoteMethodByName('prototype.__get__orderAddress');
  Order.disableRemoteMethodByName('prototype.__destroy__orderAddress');

  Order.remoteMethod('createOrder', {
    accepts: {arg: 'order', type: 'Order', required: true, http: {source: 'body'}},
    returns: {arg: 'order', type: 'Order', root: true},
    http: {path: '/', verb: 'post'}
  });

  Order.remoteMethod('createOrder', {
    accepts: {arg: 'order', type: 'Order', required: true, http: {source: 'body'}},
    returns: {arg: 'order', type: 'Order', root: true},
    http: {path: '/', verb: 'put'}
  });

  Order.remoteMethod('findOrderById', {
    accepts: {arg: 'idOrder', type: 'string', required: true, http: {source: 'path'}},
    returns: {arg: 'order', type: 'Order', root: true},
    http: {path: '/:idOrder', verb: 'get'}
  });

  Order.remoteMethod('findOrders', {
    accepts: {arg: 'filter', type: 'string', required: false, http: {source: 'query'}},
    returns: {arg: 'orders', type: 'array'},
    http: {path: '/', verb: 'get'}
  });
};
