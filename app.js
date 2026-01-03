import express from "express";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();

app.use(cors({
  origin: "http://56.228.33.77",
  credentials: true
}));
  
app.use(express.json());

app.use("/api", gameRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

export default app; 
 