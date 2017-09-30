var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;
var bitedb = require('./../index.js');

describe('BiteDB', function() {

  var db = new bitedb;
  var user = { id: 0, name: "Juan" };
  var users = [{ id: 0, name: "Juan" }, { id: 1, name: "Matias" },{ id: 2, name: "Agustin" }, { id: 3, name: "Juan" }];

  it('should configure location and setDB', (done) => {
    db.configureDB({ location: "./" });
    db.setDB("educatina");

    db.dbLocation.should.equal("./");
    db.db.should.equal("educatina");
    done();
  });

  it('should Write User in DB', (done) => {
    db.write("users",user, () => {
      done();
    });
  });
  it('should read User in DB', (done) => {
    db.read("users",(data) => {
      expect(data[0]).to.eql(user)
      done();
    });
  });

  it('should Write Users in DB', (done) => {
    db.write("users",users, () => {
      done();
    });
  });

  it('should read All Users in DB', (done) => {
    db.read("users",(data) => {
      expect(data).to.eql(users)
      done();
    });
  });

  it('should read Users filterd by one condition in DB', (done) => {
    db.read("users",(data) => {
      var expectedResult = [{ id: 0, name: "Juan" },{ id: 3, name: "Juan" }]
      expect(db.filter(data, { name: 'Juan' })).to.eql(expectedResult);
      done();
    });
  });

  it('should read Users filterd by more than one condition in DB', (done) => {
    db.read("users",(data) => {
      var expectedResult = [{ id: 0, name: "Juan" }]
      expect(db.filter(data, { id: 0, name: "Juan" })).to.eql(expectedResult);
      done();
    });
  });

  it('should read Users filterd by function condition in DB', (done) => {
    db.read("users",(data) => {
      var expectedResult = [{ id: 0, name: "Juan" },{ id: 1, name: "Matias" }]
      expect(db.filter(data, (obj) => { return (obj.id < 2) })).to.eql(expectedResult);
      done();
    });
  });

});
