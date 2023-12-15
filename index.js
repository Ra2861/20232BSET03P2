const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE cats (id INTEGER PRIMARY KEY, name TEXT, votes INT)");
  db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY, name TEXT, votes INT)");
});

app.post("/cats", (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      throw new Error("Nome inválido");
    }

    db.run(
      `INSERT INTO cats (name, votes) VALUES (?, 0)`,
      [name],
      function (err) {
        if (err) {
          throw err;
        } else {
          res.status(201).json({ id: this.lastID, name, votes: 0 });
        }
      }
    );
  } catch (error) {
    const errorMessage =
      error.message === undefined ? "Erro desconhecido" : error.message;
    res.status(500).send(errorMessage);
  }
});

app.post("/dogs", (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      throw new Error("Nome inválido");
    }

    db.run(
      `INSERT INTO dogs (name, votes) VALUES (?, 0)`,
      [name],
      function (err) {
        if (err) {
          throw err;
        } else {
          res.status(201).json({ id: this.lastID, name, votes: 0 });
        }
      }
    );
  } catch (error) {
    const errorMessage =
      error.message === undefined ? "Erro desconhecido" : error.message;
    res.status(500).send(errorMessage);
  }
});

app.post("/vote/:animalType/:id", (req, res) => {
  try {
    const { animalType, id } = req.params;
    if (animalType !== "cats" && animalType !== "dogs") {
      throw new Error("Tipo de animal inválido");
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("ID inválido");
    }

    const result = db.run(
      `UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`,
      [parsedId],
      function (err) {
        if (err) {
          throw err;
        } else if (this.changes === 0) {
          throw new Error("Registro não encontrado");
        } else {
          res.status(200).send("Voto computado!");
        }
      }
    );
  } catch (error) {
    const errorMessage =
      error.message === undefined ? "Erro desconhecido" : error.message;
    res.status(500).send(errorMessage);
  }
});

app.get("/cats", (req, res) => {
  try {
    db.all("SELECT * FROM cats", [], (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    const errorMessage =
      error.message === undefined ? "Erro desconhecido" : error.message;
    res.status(500).send(errorMessage);
  }
});

app.get("/dogs", (req, res) => {
  try {
    db.all("SELECT * FROM dogs", [], (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    const errorMessage =
      error.message === undefined ? "Erro desconhecido" : error.message;
    res.status(500).send(errorMessage);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ocorreu um erro!");
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});
