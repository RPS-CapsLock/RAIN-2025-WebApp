const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Endpoint Tests (Safe Routes Only)', () => {

  it('GET /users should return 200 and an array', function (done) {
    this.timeout(10000);
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('POST /users should create a new user', function (done) {
    this.timeout(10000);
    chai.request(app)
      .post('/users')
      .send({ username: 'testuser_' + Date.now(), password: 'testpass' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('GET /cocktails should return 200 and a list', function (done) {
    this.timeout(10000);
    chai.request(app)
      .get('/cocktails')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('GET /drinks should return 200 and a list', function (done) {
    this.timeout(10000);
    chai.request(app)
      .get('/drinks')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  }); // get

});