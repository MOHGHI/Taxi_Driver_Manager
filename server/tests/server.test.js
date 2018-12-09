const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Driver} = require('./../models/driver');

const driver = [{
  _id: new ObjectID(),
  firstName:'Ali',
  lastName:'kamal',
  email:'kam@mail.ru',
  contactNumber:'897554',
  registrationDate:'12.12.2016',
  status: 'active',
  vehicleName:'V'
},
  {
  _id: new ObjectID(),
  firstName:'Salih',
  lastName:'hamid',
  email:'sal@mail.ru',
  contactNumber:'84512',
  registrationDate:'12.12.2018',
  status: 'active',
  vehicleName:'D'
}];

beforeEach((done) => {
  Driver.deleteMany({}).then(() => {
    return Driver.insertMany(driver);
  }).then(() => done());
});

describe('POST /drivers', () => {
  it('should create a new driver', (done) => {
    var driver1 =
    {
      firstName:'Aiman',
      lastName:'Radi',
      email:'sal@mail.ru',
      contactNumber:'8520',
      registrationDate:'12.12.2000',
      status: 'active',
      vehicleName:'D'
    };

    request(app)
      .post('/drivers')
      .send(driver1)
      .expect(200)
      .expect((res) => {
console.log(driver1.firstName);
        expect(res.body.firstName).toBe(driver1.firstName);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Driver.find(driver1).then((drivers) => {
          expect(drivers.length).toBe(1);
          expect(drivers[0].firstName).toBe(driver1.firstName);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create driver with invalid body data', (done) => {
    request(app)
      .post('/drivers')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Driver.find().then((drivers) => {
          expect(drivers.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /drivers', () => {
  it('should get all drivers', (done) => {
    request(app)
      .get('/drivers')
      .expect(200)
      .expect((res) => {
        expect(res.body.drivers.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /drivers/:id', () => {
  it('should return drivers doc', (done) => {
    request(app)
      .get(`/drivers/${driver[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.driver.firstName).toBe(driver[0].firstName);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/drivers/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/drivers/123abc')
      .expect(404)
      .end(done);
  });
});
//
describe('DELETE /drivers/:id', () => {
  it('should remove a driver', (done) => {
    var hexId = driver[1]._id.toHexString();

    request(app)
      .delete(`/drivers/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.driver._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Driver.findById(hexId).then((driver) => {
          expect(driver).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if driver not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/drivers/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/drivers/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /drivers/:id', () => {
  it('should update the driver', (done) => {
    var hexId = driver[0]._id.toHexString();
    var firstName = 'Saddam';

    request(app)
      .patch(`/drivers/${hexId}`)
      .send({
        firstName
        //status: 'active'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.driver.firstName).toBe(firstName)
        //expect(res.body.driver.status).toBe('active');
      })
      .end(done);
  });

  it('should clear status when todo is not completed', (done) => {
    var hexId = driver[1]._id.toHexString();
    var firstName = 'Osama';

    request(app)
      .patch(`/drivers/${hexId}`)
      .send({
        //status: 'not active',
        firstName
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.driver.firstName).toBe(firstName);
        //expect(res.body.driver.status).toBe('not active');
      })
      .end(done);
  });
});
