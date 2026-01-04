import express from "express";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();
app.use(express.json());

app.use(cors({
  // origin: "http://localhost:5173",
  origin: "http://56.228.33.77",
  credentials: true
}));
  
app.use("/api", gameRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  console.log(`❌ 404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: "error",
    message: "Endpoint not found"
  });
});

export default app; 
 