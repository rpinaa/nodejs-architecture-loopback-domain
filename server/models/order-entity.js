module.exports = OrderEntity => {

  OrderEntity.throwErrorIfNotExist = exist =>
    new Promise((solve, reject) => exist ? reject('4001') : solve());

  OrderEntity.throwErrorIfNone = order =>
    new Promise((solve, reject) => order ? solve(order) : reject('4001'));
};
