import express from 'express'
import gameRoutes from './routes/gameRoutes.js'
import cors from 'cors'


const app = express()

app.use(cors({
  origin: 'http://56.228.33.77',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', gameRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});



export default app 