import express from 'express';
import {
  createGame,
  playRound,
  getAllGames,
  getGameById,
  getGameStats
} from '../controllers/gameController.js';

const router = express.Router();

router.post('/games', createGame);
router.post('/games/playround', playRound);
router.get('/games', getAllGames);
router.get('/games/:id', getGameById);
router.get('/games-stats', getGameStats);

export default router;
