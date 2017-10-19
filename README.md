# biteDB

biteDB is a row based LITE LOCAL JSON DATABASE.

### Tech

* [Express] 
* [Jsonschema]
* [Morgan] .
* [Babel-cli] 
* [Babel-preset-es201] 
* [Chai] 
* [Mocha] 
* [Rimraf] 

### Installation

biteDB requires [Node.js](https://nodejs.org/) v6+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd bitedb
$ nvm use 6.0
$ npm install 
$ npm run test
```

Or in your `package.json`

```json
"dependencies": {
    "bitedb": "git+https://github.com/Joker9090/bitedb.git"
}
```

### Use

In your app.js
```js
import bitedb from 'bitedb';

var db = new bitedb;
db.configureDB({ location: "./" });
db.setDB("[name_of_db_file]");

var users = [{ id: 0, name: "Juan" }, { id: 1, name: "Matias" },{ id: 2, name: "Agustin" }, { id: 3, name: "Juan" }];

//Write Users
db.write("users",users, () => {
    //done
});

//Read Users
db.read("users", (data) => {
  //data == users
});

//Read Filtered users
db.read("users" ,(data) => {
  var r = db.filter(data, { name: 'Juan' })); 
  // r == [{ id: 0, name: "Juan" }, { id: 3, name: "Juan" }]
});

//add one
db.add("users",{ id: 4, name: "Marcos" }, () => {
    db.read("users", (data) => {
        //data == [{ id: 0, name: "Juan" }, { id: 1, name: "Matias" },{ id: 2, name: "Agustin" }, { id: 3, name: "Juan" }, { id: 4, name: "Marcos" }];
    });
  });
  
//remove
db.remove("users", { id: 1, name: "Matias" },() => {
    db.read("users",(data) => {
        //data == [{ id: 0, name: "Juan" }, { id: 2, name: "Agustin" }, { id: 3, name: "Juan" }, { id: 4, name: "Marcos" }];
    });
});

//update ( the second parameter is the filter condition )
db.update("users",{ id: 0 },{ name: "Juan Martin" },() => {
    db.read("users",(data) => {
        // data[0] == { id: 0, name: 'Juan Martin' }
    });
});
```
License
----

MIT


**Free Software, Hell Yeah!**
