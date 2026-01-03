import app from "./app.js";
import sequelize from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1️⃣ Test DB connection
    await sequelize.authenticate();
    console.log("AWS RDS PostgreSQL connected");

    // 2️⃣ Sync models (development only)
    await sequelize.sync({
      alter: process.env.NODE_ENV !== "production"
    });
    console.log("Sequelize models synced");

    // 3️⃣ Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(" Database connection failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();
