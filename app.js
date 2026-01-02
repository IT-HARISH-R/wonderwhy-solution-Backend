import express from 'express'
import gameRoutes from './routes/gameRoutes.js'
import cors from 'cors'


const app = express()

app.use(cors({
  // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  origin: 'http://localhost:5173',
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

// Error handling middleware

// app.use((err, req, res, next) => { 
//   console.error(err.stack);
//   res.status(500).json({ 
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : {}
//   });
// });

// 404 handler

// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Endpoint not found' });
// });


export default app 