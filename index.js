var fs = require('fs');
var jv = require('jsonschema').Validator;
jv = new jv();

var bitedb = function(){
  this.dbLocation;
  this.db;

  this.checkDBLocation = () => {
    var direction = this.dbLocation+"/db";
    if (!fs.existsSync(direction)) fs.mkdirSync(direction);
    return true;
  }
  this.checkDB = (fn) => {
    var direction = this.dbLocation+"/db/"+this.db+".json";
    if (!fs.existsSync(direction)) fs.writeFile(direction,'',fn)
    else fn();
  }
  this.configureDB = (obj = { location: __dirname }) => {
    this.dbLocation = obj.location;
    this.checkDBLocation();
  }
  this.setDB = (DBname) => {
    this.db = DBname
  }
  this.read = (tableObject,fn) => {
    this.checkDB(() => {
      var direction = this.dbLocation+"/db/"+this.db+".json";
      fs.readFile(direction, 'utf8', function (err, data) {
        if (err) throw err;
        data = (data.length > 0) ? JSON.parse(data) : data
        var result = jv.validate(data,{ "type": "object" });
        if (result.errors.length > 0) console.log("JSON has the following errors: " + result.errors.join(", "));
        fn( (data[tableObject] != undefined) ? data[tableObject] : "empty" );
      });
    });
  }
  this.readAll = (fn) => {
    var direction = this.dbLocation+"/db/"+this.db+".json";
    fs.readFile(direction, 'utf8', function (err, data) {
      if (err) throw err;
      data = (data.length > 0) ? JSON.parse(data) : data
      var result = jv.validate(data,{ "type": "object" });
      if (result.errors.length > 0) console.log("JSON has the following errors: " + result.errors.join(", "));
      fn( (data != undefined) ? data : {} );
    })
  }
  this.write = (tableObject,items,fn) => {
    var direction = this.dbLocation+"/db/"+this.db+".json";
    this.read(tableObject,(data) => {
      var o = (data[tableObject] != undefined) ? JSON.parse(data[tableObject]) : Object()
      o[tableObject] = Array();
      items = (items.constructor !== Array) ? [items] : items;
      items.map((i) => { o[tableObject].push(i) });
      this.replaceInFile(tableObject,o,fn);
    });
  }
  this.replaceInFile = (tableObject,newValue,fn) => {
    var direction = this.dbLocation+"/db/"+this.db+".json";
    this.readAll((allData) => {
      var allNew = Object.assign({}, allData, newValue);
      fs.writeFile(direction,JSON.stringify(allNew, null, 2),fn);
    })
  }
  this.checkObject = (obj,schema) => {
    var result = jv.validate(obj,schema);
    if (result.errors.length > 0) console.log("JSON has the following errors: " + result.errors.join(", "));
    return true;
  }
  this.compare = (objA,objB) => {
    return (objA == objB);
  }
  this.filter = (all, condition) => {
    function checkCondition(items,key,particularCondition) {
      items = (items.constructor !== Array) ? [items] : items;
      return items.filter((item) => {
         if (item[key] == particularCondition) return item;
      })
    }
    function checkFunctionondition(items,functionCondition) {
      items = (items.constructor !== Array) ? [items] : items;
      return items.filter((item) => {
        if (functionCondition(item)) return item;
      })
    }
    if(typeof condition == "function") all = checkFunctionondition(all,condition);
    else {
      for (var variable in condition) {
        if (condition.hasOwnProperty(variable)) {
          all = checkCondition(all,variable,condition[variable]);
        }
      }
    }
    return all;
  }
  this.update = (tableObject,filter,objectChanges,fn) => {
    this.read(tableObject, (data) => {
      var objs = data.map((item) => {
        var filteredItem = this.filter(item,filter);
        return (filteredItem.length > 0) ? Object.assign({}, item, objectChanges) : item;
      });
      this.write(tableObject,objs,fn);
    });
  }
  this.add = (tableObject,items,fn) => {
    this.read(tableObject, (data) => {
      items = (items.constructor !== Array) ? [items] : items;
      items.map((item) => { data.push(item); });
      this.write(tableObject,data,fn);
    });
  }
  this.remove = (tableObject,items,fn) => {
    this.read(tableObject, (data) => {
      items = (items.constructor !== Array) ? [items] : items;
      data.filter((item) => { return (!items.indexOf(item) > -1 ) });
      this.write(tableObject,data,fn);
    });
  }
}

module.exports = bitedb;
