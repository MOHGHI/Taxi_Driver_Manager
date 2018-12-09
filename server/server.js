require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Driver} = require('./models/driver');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/drivers', (req, res) => {
  var driver = new Driver({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    contactNumber: req.body.contactNumber,
    registrationDate: req.body.registrationDate,
    status: req.body.status,
    vehicleName: req.body.vehicleName,
    vehicleModel: req.body.vehicleModel,
    vehicleMaker: req.body.vehicleMaker
  });

  driver.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/drivers', (req, res) => {
  Driver.find().then((drivers) => {
    res.send({drivers});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/drivers/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Driver.findById(id).then((driver) => {
    if (!driver) {
      return res.status(404).send();
    }

    res.send({driver});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/drivers/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Driver.findByIdAndRemove(id).then((driver) => {
    if (!driver) {
      return res.status(404).send();
    }

    res.send({driver});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/drivers/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['firstName','lastName','email','contactNumber','registrationDate','status','vehicleName','vehicleModel','vehicleMaker']);
//console.log(body);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }


  Driver.findByIdAndUpdate(id, {$set: body}, {new: true}).then((driver) => {
    if (!driver) {
      return res.status(404).send();
    }

    res.send({driver});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
