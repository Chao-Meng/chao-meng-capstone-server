const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const port = 8080;

const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
const users = {
  user1: "password123",
  user2: "password1234",
};
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

app.get("/waterData", (req, res) => {
  connection.query("SELECT * FROM water_Data", (err, results) => {
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

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials!" });
  }
});

app.get("/faqs", (req, res) => {
  connection.query("SELECT * FROM faq", (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error fetching FAQs from database" });
    }
    res.json(results);
  });
});

app.get("/team", (req, res) => {
  connection.query("SELECT * FROM team_members", (error, results) => {
    if (error) {
      return res.status(500).send("Error fetching team members");
    }
    res.json(results);
  });
});

app.post("/team", (req, res) => {
  const { id, name, phoneNumber, email, title } = req.body;
  const query =
    "INSERT INTO team_members (id, name, phoneNumber, email, title) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [id, name, phoneNumber, email, title],
    (error, results) => {
      if (error) {
        return res.status(500).send("Error adding team member");
      }
      // res.status(201).json({ ...req.body, id: results.insertId });
      res.status(201).json(req.body);
    }
  );
});

app.delete("/team/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM team_members WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send("Error deleting team member");
    }
    res.status(200).send("Team member deleted");
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
