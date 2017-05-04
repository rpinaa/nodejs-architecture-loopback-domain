'use strict';

module.exports = Address => {

  /*
   * Business constraints
   * */

  Address.validatesFormatOf('id', {with: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/});
  Address.validatesLengthOf('intNumber', {'min': 1, 'max': 5});
  Address.validatesLengthOf('extNumber', {'min': 1, 'max': 5});
  Address.validatesLengthOf('block', {'min': 1, 'max': 5});
  Address.validatesLengthOf('number', {'min': 1, 'max': 5});
  Address.validatesLengthOf('street', {'min': 3, 'max': 15});
  Address.validatesLengthOf('colony', {'min': 3, 'max': 15});
  Address.validatesLengthOf('municipality', {'min': 3, 'max': 20});
  Address.validatesLengthOf('state', {'min': 3, 'max': 15});
  Address.validatesLengthOf('country', {'min': 3, 'max': 10});
};
