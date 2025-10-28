
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json({ limit: '10MB' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//  Step 1: Connect Sequelize to MySQL
const sequelize = new Sequelize("movies_db", "root", "8074045278@n", {
  host: "localhost",
  dialect: "mysql",
});

//  Step 2: Define Movie Model
const Movie = sequelize.define("Movie", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("Movie", "TV Show"),
    allowNull: false,
  },
  director: {
    type: DataTypes.STRING,
  },
  budget: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.STRING,
  },
});

//  Step 3: Sync DB (creates table if not exists)
sequelize
  .sync()
  .then(() => console.log(" Database synced successfully"))
  .catch((err) => console.error(" Error syncing database:", err));

//  Step 4: Routes
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/movies", async (req, res) => {
  const { title, type, director, budget, location, duration, year } = req.body;
  try {
    await Movie.create({ title, type, director, budget, location, duration, year });
    res.json({ message: "Movie added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add movie" });
  }
});


app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  await Movie.update(req.body, { where: { id } });
  res.json({ message: "Movie updated successfully" });
});

// Delete a movie
app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  await Movie.destroy({ where: { id } });
  res.json({ message: "Movie deleted successfully" });
});

//  Step 5: Start Server
app.listen(5000, () => {
  console.log(" Server is Running at: http://localhost:5000");
});
