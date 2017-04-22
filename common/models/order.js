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

    const sourceOrder = new Order(Order.app.models.OrderMapper.build.map(order));

    async.waterfall([
      (callback) => {

        sourceOrder.isValid((valid) => valid ? callback() : callback(sourceOrder.errors));
      },
      (callback) => {

        OrderEntity.exists(sourceOrder.id, (err, exists) => {
          err ? callback(err) : exists ? callback('ERROR-4001') : callback();
        });
      },
      (callback) => {

        OrderEntity.beginTransaction('READ COMMITTED', (err, tx) => err ? callback(err) : callback(null, tx));
      },
      (tx, callback) => {
        const targetAddressEntity = new AddressEntity(sourceOrder.address);

        AddressEntity.create(targetAddressEntity, {transaction: tx}, (err, sourceAddressEntity) => {
          const targetOrderEntity = new OrderEntity(sourceOrder);

          targetOrderEntity.address(sourceAddressEntity);

          OrderEntity.create(targetOrderEntity, {transaction: tx}, (err, sourceOrderEntity) => {
            err ? callback(err) : callback(null, sourceOrderEntity, sourceAddressEntity, tx);
          });
        });
      },
      (sourceOrderEntity, sourceAddressEntity, tx, callback) => {

        tx.commit((err) => {
          const order = new Order(sourceOrderEntity);

          order.address = sourceAddressEntity;

          callback(err, Order.app.models.OrderMapper.build.reverseMap(order));
        });
      }
    ], cb);
  };

  Order.updateOrder = (order, cb) => {

    const sourceOrder = new Order(Order.app.models.OrderMapper.build.map(order));

    async.waterfall([
      (callback) => {

        sourceOrder.isValid((valid) => valid ? callback() : callback(sourceOrder.errors));
      },
      (callback) => {

        OrderEntity.findById(sourceOrder.id, {include: 'address'}, (err, sourceOrderEntity) => {
          err ? callback(err) : sourceOrderEntity ? callback(null, sourceOrderEntity) : callback('ERROR-4002');
        });
      },
      (sourceOrderEntity, callback) => {

        OrderEntity.beginTransaction('READ COMMITTED', (err, tx) => err ? callback(err) : callback(null, sourceOrderEntity, tx));
      },
      (sourceOrderEntity, tx, callback) => {

        const addressEntity = new AddressEntity(sourceOrder.address);

        sourceOrderEntity.address.update(addressEntity, {transaction: tx}, (err, sourceAddressEntity) => {
          const targetOrderEntity = new OrderEntity(order);

          sourceOrderEntity.updateAttributes(targetOrderEntity, {transaction: tx}, (err, sourceOrderEntity) => {
            err ? callback(err) : callback(null, sourceOrderEntity, sourceAddressEntity, tx);
          });
        });
      },
      (sourceOrderEntity, sourceAddressEntity, tx, callback) => {

        tx.commit((err) => {
          const order = new Order(sourceOrderEntity);

          order.address = sourceAddressEntity;

          callback(err, Order.app.models.OrderMapper.build.reverseMap(order));
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
   * Remote API methods
   * */

  Order.remoteMethod('createOrder', {
    accepts: {arg: 'order', type: 'Order', required: true, http: {source: 'body'}},
    returns: {arg: 'order', type: 'Order', root: true},
    http: {path: '/', verb: 'post'}
  });

  Order.remoteMethod('updateOrder', {
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

  Order.disableRemoteMethodByName('prototype.__create__orderAddress');
  Order.disableRemoteMethodByName('prototype.__update__orderAddress');
  Order.disableRemoteMethodByName('prototype.__get__orderAddress');
  Order.disableRemoteMethodByName('prototype.__destroy__orderAddress');
};
