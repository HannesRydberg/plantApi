const sqlite3 = require("sqlite3");
var path = require('path');

let testDBConnection =  () => {
    let db = openDB();
    if(db != null){
        db.close();
        console.log("Could connect to database!");
    } else {
        console.log("Can't connect to database!");
    }
};

let addPlantData = (sensorId, sensorValue) =>  {
    let db = openDB();
    if (db != null){
        db.run("INSERT INTO plantReadings(sensorId, sensorValue) VALUES(?, ?)", [sensorId, sensorValue]);
        db.close();
    }
};

let getAllPlantData = (callback) => {
    let db = openDB();
    let result = [];
    if(db!= null){
        let sql = "SELECT sensorId, sensorValue, time FROM plantReadings"
        db.each(sql, [], (err, row) => {
            if(err){
                throw err;
            }
            result.push(row);
        }, () => {
            db.close();
            callback(result);
        });
    }
}

let getLatestPlantData = (callback) => {
  let db = openDB();
  let result = [];
  if(db!= null){
      let sql = "SELECT sensorId, sensorValue, time FROM plantReadings GROUP BY sensorId"
      db.each(sql, [], (err, row) => {
          if(err){
              throw err;
          }
          result.push(row);
      }, () => {
          db.close();
          callback(result);
      });
  }
}

let openDB = () => {
    let db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'plantdata.db'), (err) => {
        if (err){
            console.error(err.message);
            return null;
        }
    } );
    return db;
}

module.exports = {
    testDBConnection: testDBConnection,
    addPlantData: addPlantData,
    getAllPlantData: getAllPlantData,
    getLatestPlantData: getLatestPlantData
}
