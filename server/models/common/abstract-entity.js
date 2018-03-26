module.exports = AbstractEntity => {
  AbstractEntity.getTx = (err, tx) => new Promise((solve, reject) => err ? reject(err) : solve(tx));
};
