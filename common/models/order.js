'use strict';

const AddressEntity = require('loopback').getModel('AddressEntity');
const OrderEntity = require('loopback').getModel('OrderEntity');

module.exports = function (Order) {

  Order.create = (order, cb) => {
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

  Order.remoteMethod('create', {
    accepts: {arg: 'order', type: 'Order', required: true, http: {source: 'body'}},
    returns: {arg: 'order', type: 'Order', "root": true},
    http: {path: '/', verb: 'post'}
  });
};
