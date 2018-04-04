const server = require('../server/server');
const loopback = require('loopback');

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const supertest = require('supertest');
const request = require('supertest')(server);

server.dataSources.mysql.setMaxListeners(0);

describe('Order RESTFul Integration Testing', () => {
  before(async() => await server.dataSources.mysql.automigrate());

  after(async() => await server.dataSources.mysql.disconnect());

  it('findOrders', (done) => {
    request
      .get('/api/orders')
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('orders');
        expect(res.body).to.have.property('total');
        expect(res.body.orders).to.not.equal(null);
        expect(res.body.total).to.not.equal(null);
        expect(res.body.orders).to.be.an('array');
        expect(res.body.total).to.be.a('number');
        expect(res.body.total).to.equal(res.body.orders.length);

        done();
      });
  });

  it('createOrder', (done) => {
    const order = {
      "name": "string",
      "latitude": 85.23,
      "longitude": 180,
      "status": "string",
      "timeZone": "America/Mexico_City",
      "scheduled": "string",
      "comments": "string",
      "total": 0,
      "address": {
        "intNumber": "1",
        "extNumber": "25",
        "block": "2",
        "number": "23",
        "street": "string",
        "colony": "string",
        "municipality": "string",
        "state": "string",
        "country": "string"
      }
    };

    request.post('/api/orders')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send(order)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);

        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('address');
        expect(res.body.address).to.have.property('id');

        expect(res.body.id).to.not.equal(null);
        expect(res.body.createdAt).to.not.equal(null);
        expect(res.body.address.id).to.not.equal(null);

        done();
      });
  });

  it('updateOrder', (done) => {
    const order = {
      "name": "string1",
      "latitude": 85.23,
      "longitude": 180,
      "status": "string",
      "timeZone": "America/Mexico_City",
      "scheduled": "string",
      "comments": "string",
      "total": 0,
      "address": {
        "intNumber": "1",
        "extNumber": "25",
        "block": "2",
        "number": 23,
        "street": "string",
        "colony": "string",
        "municipality": "string",
        "state": "string",
        "country": "string"
      }
    };

    request.post('/api/orders')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send(order)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('id');
        expect(res.body.companyId).to.not.equal(null);

        const targetOrder = {
          id: res.body.id,
          name: 'string1',
          status: 'string',
          timeZone: 'America/Mexico_City',
          scheduled: 'string',
          comments: 'string',
          total: 0,
          latitude: 45.56,
          longitude: 117.45,
          address: {
            id: res.body.address.id,
            number: 35,
            intNumber: 1,
            extNumber: 25,
            block: 2,
            street: 'string',
            colony: 'string',
            municipality: 'string',
            state: 'string',
            country: 'strin'
          }
        };

        request.put('/api/orders')
          .set('Content-Type', 'application/json;charset=UTF-8')
          .send(targetOrder)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.have.property('latitude');
            expect(res.body).to.have.property('longitude');
            expect(res.body).to.have.property('address');
            expect(res.body.address).to.have.property('number');

            expect(res.body.latitude).to.be.equal(targetOrder.latitude);
            expect(res.body.longitude).to.be.equal(targetOrder.longitude);
            expect(res.body.address.number).to.be.equal(String(targetOrder.address.number));

            done();
          });
      });
  });
});