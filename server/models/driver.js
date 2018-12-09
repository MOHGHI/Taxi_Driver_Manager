var mongoose = require('mongoose');

var Driver = mongoose.model('Driver', {
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  contactNumber: {type: String, required: true},
  registrationDate: {type: Date, required: true},
  status: {type: String, required: true, default: 'not active'},
  vehicleName: {type: String, required: true},
  vehicleModel: {type: String, required: false},
  vehicleMaker: {type: String, required: false}
});

module.exports = {Driver};
