module.exports = OrderEntity => {
  OrderEntity.validatesLengthOf('name', {min: 3, max: 15});
  OrderEntity.validatesLengthOf('name', {min: 3, max: 15});
  OrderEntity.validatesFormatOf('id', {with: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/});
  OrderEntity.validatesFormatOf('latitude', {with: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/});
  OrderEntity.validatesFormatOf('longitude', {with: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/});
  OrderEntity.validatesPresenceOf('timeZone', 'comments', 'total');

  OrderEntity.throwErrorIfNotExist = exist =>
    new Promise((solve, reject) => exist ? reject('4001') : solve());

  OrderEntity.throwErrorIfNone = order =>
    new Promise((solve, reject) => order ? solve(order) : reject('4001'));
};
