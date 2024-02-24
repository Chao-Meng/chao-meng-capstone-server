const mysql = require("mysql");
const fs = require("fs");

const electricData = JSON.parse(
  fs.readFileSync("scripts/data/electricData.json", "utf8")
);
const energyData = JSON.parse(
  fs.readFileSync("scripts/data/energyData.json", "utf8")
);
const waterData = JSON.parse(
  fs.readFileSync("scripts/data/waterData.json", "utf8")
);
const faqsData = JSON.parse(fs.readFileSync("scripts/data/faqs.json", "utf8"));
const teamMembersData = JSON.parse(
  fs.readFileSync("scripts/data/teamMember.json", "utf8")
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

waterData.forEach((item) => {
  const { id, color, data } = item;
  data.forEach((dataItem) => {
    const { x, y } = dataItem;
    const query = `INSERT INTO water_Data (category, color, month, consumption) VALUES (?, ?, ?, ?)`;
    connection.query(query, [id, color, x, y], (error, results, fields) => {
      console.log(color);
      if (error) throw error;
      console.log(`WaterData Inserted: ${results.insertId}`);
    });
  });
});
faqsData.forEach((faq) => {
  const query = `INSERT INTO faq (question, answer) VALUES (?, ?)`;
  connection.query(query, [faq.Q, faq.A], (error, results) => {
    if (error) throw error;
    console.log(`FAQ Inserted: ${results.insertId}`);
  });
});
teamMembersData.forEach((member) => {
  const query = `INSERT INTO team_members (id, name, phoneNumber, email, title) VALUES (?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [member.id, member.name, member.phoneNumber, member.email, member.title],
    (error, results) => {
      if (error) throw error;
      console.log(`Team member inserted with ID: ${member.id}`);
    }
  );
});
connection.end();
