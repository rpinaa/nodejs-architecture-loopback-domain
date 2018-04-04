const ObjectMapper = require('two-way-object-mapper');

module.exports = OrderMapper => {
  const mapper = new ObjectMapper()
    .addPropertyMapping({from: 'page', to: 'skip'})
    .addPropertyMapping({from: 'limit', to: 'limit'})
    .addPropertyMapping({from: 'where', to: 'where'});

  OrderMapper.map = order => mapper.map(order);
};
