import express from 'express';
import {
  createGame,
  playRound,
  getAllGames,
  getGameById,
  getGameStats
} from '../controllers/gameController.js';

const router = express.Router();

// Game routes
router.post('/games', createGame);
router.post('/games/play-round', playRound);
router.get('/games', getAllGames);
router.get('/games/:id', getGameById);
router.get('/games-stats', getGameStats);

export default router;