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

  it('should add 1 User in Users', (done) => {
    db.write("users",users, () => {
      var user2add = { id: 4, name: "Rogelio" }
      db.add("users",user2add,() => {
        db.read("users",(data) => {
          var expectedResult = users.concat(user2add);
          expect(data).to.eql(expectedResult);
          done();
        })
      });
    });
  });

  it('should add more than one User in Users', (done) => {
    db.write("users",users, () => {
      var users2add = [{ id: 5, name: "Carlos" }, { id: 6, name: "Ruben Rada" }]
      db.add("users",users2add,() => {
        db.read("users",(data) => {
          var expectedResult = users.concat(users2add);
          expect(data).to.eql(expectedResult);
          done();
        })
      });
    });
  });

  it('should remove one User in Users', (done) => {
    db.write("users",users, () => {
      var user2remove = { id: 0, name: "Juan" };
      db.remove("users",user2remove,() => {
        db.read("users",(data) => {
          var expectedResult = users.filter((item) => { return (![user2remove].indexOf(item) > -1 ) } );
          expect(data).to.eql(expectedResult);
          done();
        })
      });
    });
  });

  it('should remove more than one User in Users', (done) => {
    db.write("users",users, () => {
      var users2remove = [{ id: 0, name: "Juan" }, { id: 1, name: "Matias" }];
      db.remove("users",users2remove,() => {
        db.read("users",(data) => {
          var expectedResult = users.filter((item) => { return (!users2remove.indexOf(item) > -1 ) } );
          expect(data).to.eql(expectedResult);
          done();
        })
      });
    });
  });

  it('should update Users filterd in DB', (done) => {
    db.write("users",users, () => {
      db.update("users",{ id: 0 },{ name: "Juan Martin" },() => {
        db.read("users",(data) => {
          var expectedResult = { id: 0, name: 'Juan Martin' }
          expect(data[0]).to.eql(expectedResult);
          done();
        });
      });
    });
  });

});
