'use strict';

const AddressEntity = require('loopback').getModel('AddressEntity');
const OrderEntity = require('loopback').getModel('OrderEntity');

module.exports = function (Order) {

    Order.create = (order, cb) => {
        AddressEntity.create(order.address, (err, address) => {
            order.address = address;

            OrderEntity.create(order, cb);
        });
    };

    Order.remoteMethod('create', {
        accepts: {arg: 'order', type: 'Order', required: true, http: {source: 'body'}},
        returns: {arg: 'order', type: 'Order', "root": true},
        http: {path: '/', verb: 'post'}
    });
};
