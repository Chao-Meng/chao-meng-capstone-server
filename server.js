const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 8080;

const cors = require("cors");

app.use(cors());
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "capstone",
});

app.get("/electricData", (req, res) => {
  connection.query("SELECT * FROM electric_data", (error, results) => {
    if (error) throw error;
    console.log(results);
    res.json(
      results.map(({ data_id, label, value, color }) => ({
        id: data_id,
        label,
        value,
        color,
      }))
    );
  });
});

app.get("/energyData", (req, res) => {
  connection.query("SELECT * FROM energyData", (err, results) => {
    if (err) throw err;
    const formattedResults = results.map(
      ({ id, month, consumption, color }) => ({
        id,
        data: [{ x: month, y: consumption }],
        color,
      })
    );
    res.json(formattedResults);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
