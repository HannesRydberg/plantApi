const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const plantDbManager = require("./DAL/plantDBManager");

app.use(express.json());
app.use(express.urlencoded());

plantDbManager.testDBConnection();

app.post("/plant", (req, res) => {
    console.log("Incoming post request from " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + " with plant data.");
    if(req.body.sensorId != undefined && req.body.sensorValue != undefined){
        plantDbManager.addPlantData(req.body.sensorId, req.body.sensorValue);
        res.status(200).send({status:"ok", message: "Plant data added"})
    } else {
        res.status(400).send({message: "Bad Request, missing parameters."})
    }
});

app.get("/plant", (req, res) => {
    console.log("Incoming get request from " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + " for all plant data.");
    plantDbManager.getAllPlantData((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
    });
});

app.listen(3000, () => {
    console.log("PlantAPI listening at port 3000!");
})