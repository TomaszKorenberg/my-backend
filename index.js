const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const readline = require("readline-sync");
const config = require("./config.js");
const pouchDB = require("pouchdb");


//fixme: Nie działa serwer po użyciu cors. Poprawić później.
//app.use(cors);


const database = {};


/**
 * Create database and create database folder if not exist
 */

const createDB = (name) => {
    if (!fs.existsSync('./db')) {
        fs.mkdirSync('./db');
    }
    const db = new pouchDB('./db/' + name);
    database[name] = db;
    return db;
};


const changeConfigFile = (oldValue, newValue) => {
    fs.readFile("./config.js", 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        const result = data.replace(oldValue, newValue);

        fs.writeFile("./config.js", result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
};


/**
 * Requests
 */

app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.get("/db/" + config.config.shopName + "/:id", (req, res) => {
    res.send("Hello World!");
});


/**
 * Server start
 */
app.listen(config.config.port, () => {
    if (config.config.firstRun === true) {

        //first run change
        changeConfigFile(/firstRun: true/g,"firstRun: false");

        //giving shop name;
        const shopName = readline.question("What is your shop name? (Don't use spaces!)");
        changeConfigFile(/shopName: ""/g, 'shopName: "' + shopName + '"');


        createDB(config.config.shopName);

    }
    console.log("Node application started at localhost:" + config.config.port + "/")
});