const OrderMapper = require('loopback').getModel('OrderMapper');
const PageableMapper = require('loopback').getModel('PageableMapper');

const OrderEntity = require('loopback').getModel('OrderEntity');
const AddressEntity = require('loopback').getModel('AddressEntity');
const AbstractEntity = require('loopback').getModel('AbstractEntity');

module.exports = Order => {
  /*
   * Business constraints
   * */

  Order.validatesLengthOf('name', {min: 3, max: 15});
  Order.validatesLengthOf('name', {min: 3, max: 15});
  Order.validatesFormatOf('id', {with: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/});
  Order.validatesFormatOf('latitude', {with: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/});
  Order.validatesFormatOf('longitude', {with: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/});
  Order.validatesPresenceOf('timeZone', 'scheduled', 'comments', 'total', 'createdAt', 'registeredAt', 'scheduledAt', 'finishedAt');

  /*
   * Business methods
   * */

  Order.createOrder = (order, cb) => {
    const sourceOrder = new Order(OrderMapper.map(order));

    return sourceOrder
      .isValid(valid => new Promise((solve, reject) => valid ? solve() : reject(sourceOrder.errors)))
      .then(() => OrderEntity.exists(sourceOrder.id))
      .then(OrderEntity.throwErrorIfNotExist)
      .then(() => OrderEntity.beginTransaction('READ COMMITTED', AbstractEntity.getTx))
      .then(async transaction => {
        const addressEntity = new AddressEntity(sourceOrder.address);
        const orderEntity = new OrderEntity(sourceOrder);

        const ctxAddressEntity = await AddressEntity.create(addressEntity, {transaction});

        orderEntity.address(ctxAddressEntity);

        const ctxOrderEntity = await OrderEntity.create(orderEntity, {transaction});
        const order = new Order(ctxOrderEntity);

        order.address = ctxAddressEntity;

        return OrderMapper.reverseMap(order);
      })
      .catch(cb);
  };

  Order.updateOrder = (order, cb) => {
    const sourceOrder = new Order(OrderMapper.map(order));

    return sourceOrder
      .isValid(valid => new Promise((solve, reject) => valid ? solve() : reject(sourceOrder.errors)))
      .then(() => OrderEntity.exists(sourceOrder.id))
      .then(OrderEntity.throwErrorIfNotExist)
      .then(() => OrderEntity.beginTransaction('READ COMMITTED', AbstractEntity.getTx))
      .then(async transaction => {
        const ctxOrderEntity = await OrderEntity.findById(sourceOrder.id, {include: 'address'});

        const addressEntity = new AddressEntity(sourceOrder.address);

        const ctxAddressEntity = await ctxOrderEntity.address.update(addressEntity, {transaction});

        const orderEntity = new OrderEntity(sourceOrder);

        await ctxOrderEntity.updateAttributes(orderEntity, {transaction});

        const order = new Order(ctxOrderEntity);

        order.address = ctxAddressEntity;

        return OrderMapper.reverseMap(order);
      })
      .catch(cb);
  };

  Order.findOrderById = (idOrder, cb) =>
    OrderEntity
      .findById(idOrder, {})
      .then(OrderEntity.throwErrorIfNone)
      .then(async ctxOrderEntity => OrderMapper.reverseMap(ctxOrderEntity))
      .catch(cb);

  Order.findOrders = (filters, cb) =>
    OrderEntity
      .find(PageableMapper.map(filters && JSON.parse(filters) || {}))
      .then(async ctxOrdersEntity => ctxOrdersEntity.map(orderEntity => new Order(orderEntity)))
      .then(async ctxOrders => OrderMapper.reverseMapList(ctxOrders))
      .catch(cb);
};
