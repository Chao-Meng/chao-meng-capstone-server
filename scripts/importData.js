const mysql = require("mysql");
const fs = require("fs");

const electricData = JSON.parse(
  fs.readFileSync("scripts/data/electricData.json", "utf8")
);
const energyData = JSON.parse(
  fs.readFileSync("scripts/data/energyData.json", "utf8")
);
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "capstone",
});

connection.connect();

electricData.forEach((item) => {
  const { id, label, value, color } = item;
  const query = `INSERT INTO electric_data (data_id, label, value, color) VALUES (?, ?, ?, ?)`;
  connection.query(
    query,
    [id, label, value, color],
    (error, results, fields) => {
      if (error) throw error;
      console.log(`Inserted: ${results.insertId}`);
    }
  );
});
energyData.forEach((item) => {
  const { id, color, data } = item;
  data.forEach((dataItem) => {
    const { x, y } = dataItem;
    const query = `INSERT INTO energyData (category, color, month, consumption) VALUES (?, ?, ?, ?)`;
    connection.query(query, [id, color, x, y], (error, results, fields) => {
      console.log(color);
      if (error) throw error;
      console.log(`EnergyData Inserted: ${results.insertId}`);
    });
  });
});
connection.end();
