const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors");
const serviceAccount = require("./admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tech-interview-cars.firebaseio.com/",
});
const db = admin.database();

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  const ref = db.ref("cars");

  ref.once("value", function(snapshot) {
    const values = [];
    snapshot.forEach((child) => {
      values.push(child.val());
    });
    res.set("Access-Control-Allow-Origin", "*");
    res.send(values);
  }).then().catch();
});

app.post("/", function(req, res) {
  const id = req.body.id;
  const status = req.body.status;
  const customer = req.body.customer;
  const estimatedDate = req.body.estimatedDate;
  res.set("Access-Control-Allow-Origin", "*");
  const ref = db.ref("cars");
  ref.child(id).update({
    "status": status,
    "customer": customer,
    "estimatedDate": estimatedDate})
      .then(() => {
        ref.once("value", function(snapshot) {
          const values = [];
          snapshot.forEach((child) => {
            values.push(child.val());
          });
          res.set("Access-Control-Allow-Origin", "*");
          res.send(values);
        });
      }).catch();
});

exports.app = functions.https.onRequest(app);
