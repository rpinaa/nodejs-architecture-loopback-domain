'use strict';

const AddressEntity = require('loopback').getModel('AddressEntity');
const OrderEntity = require('loopback').getModel('OrderEntity');

module.exports = (Order) => {

  /*
  * Business constraints
  * */

  Order.validatesLengthOf('name', {'min': 3, 'max': 15});
  Order.validatesNumericalityOf('latitude', {'int': false});
  Order.validatesNumericalityOf('longitude', {'int': false});
  Order.validatesFormatOf('latitude', {'with': /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/});
  Order.validatesFormatOf('longitude', {'with': /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/});

  /*
  * Business methods
  * */

  Order.createOrder = (order, cb) => {
    if (!order.isValid()) cb(order.errors);

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
  };

  Order.findOrderById = (idOrder, cb) => OrderEntity.findById(idOrder, {include: 'address'}, cb);

  Order.findOrders = (filters, cb) => {
    const query = filters || JSON.parse(filters);

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