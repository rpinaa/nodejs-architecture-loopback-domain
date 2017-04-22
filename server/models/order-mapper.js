const ObjectMapper = require('two-way-object-mapper');

module.exports = (OrderMapper) => {

  OrderMapper.build = (() => {
    return new ObjectMapper()
      .addPropertyMapping({from: 'id', to: 'id'})
      .addPropertyMapping({from: 'name', to: 'name'})
      .addPropertyMapping({from: 'latitude', to: 'latitude'})
      .addPropertyMapping({from: 'longitude', to: 'longitude'})
      .addPropertyMapping({from: 'status', to: 'status'})
      .addPropertyMapping({from: 'timeZone', to: 'timeZone'})
      .addPropertyMapping({from: 'scheduled', to: 'scheduled'})
      .addPropertyMapping({from: 'comments', to: 'comments'})
      .addPropertyMapping({from: 'total', to: 'total'})
      .addPropertyMapping({from: 'createdAt', to: 'createdAt'})
      .addPropertyMapping({from: 'registeredAt', to: 'registeredAt', default: null})
      .addPropertyMapping({from: 'scheduledAt', to: 'scheduledAt', default: null})
      .addPropertyMapping({from: 'finishedAt', to: 'finishedAt', default: null})
      .addPropertyMapping({from: 'address.id', to: 'address.id'})
      .addPropertyMapping({from: 'address.intNumber', to: 'address.intNumber'})
      .addPropertyMapping({from: 'address.extNumber', to: 'address.extNumber'})
      .addPropertyMapping({from: 'address.block', to: 'address.block'})
      .addPropertyMapping({from: 'address.number', to: 'address.number'})
      .addPropertyMapping({from: 'address.street', to: 'address.street'})
      .addPropertyMapping({from: 'address.colony', to: 'address.colony'})
      .addPropertyMapping({from: 'address.municipality', to: 'address.municipality'})
      .addPropertyMapping({from: 'address.state', to: 'address.state'})
      .addPropertyMapping({from: 'address.country', to: 'address.country'});
  })()

};
