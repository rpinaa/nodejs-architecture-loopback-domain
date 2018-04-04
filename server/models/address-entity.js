module.exports = AddressEntity => {
  AddressEntity.validatesFormatOf('id', {with: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/});
  AddressEntity.validatesLengthOf('intNumber', {'min': 1, 'max': 5});
  AddressEntity.validatesLengthOf('extNumber', {'min': 1, 'max': 5});
  AddressEntity.validatesLengthOf('block', {'min': 1, 'max': 5});
  AddressEntity.validatesLengthOf('number', {'min': 1, 'max': 5});
  AddressEntity.validatesLengthOf('street', {'min': 3, 'max': 15});
  AddressEntity.validatesLengthOf('colony', {'min': 3, 'max': 15});
  AddressEntity.validatesLengthOf('municipality', {'min': 3, 'max': 20});
  AddressEntity.validatesLengthOf('state', {'min': 3, 'max': 15});
  AddressEntity.validatesLengthOf('country', {'min': 3, 'max': 10});
};
