const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;
const cors = require("cors");
const mongoose = require("mongoose");
const colorRoutes = require("./routes/colorRoutes");

(async () => {
  try {
    app.use(express.json());
    app.use(cors());

    app.get("/", (req, res) => {
      res.send("SWC-COLORS");
    });

    app.use("/api/colors", colorRoutes);

    await mongoose
      .connect(CONNECTION_URL)
      .then(async () => {
        app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
      })
      .catch((err) => console.error("Error in DB connection"));
  } catch (err) {
    console.error("Something went wrong on a server", err);
  }
})();
