import prisma from "../prismaClient.js";

// CREATE GAME
export const createGame = async (req, res) => {
  try {
    const game = await prisma.game.create({
      data: {
        player1Name: req.body.player1Name,
        player2Name: req.body.player2Name
      }
    });
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PLAY ROUND
export const playRound = async (req, res) => {
  const { gameId, roundNumber, player1Choice, player2Choice, winner } = req.body;

  try {
    const round = await prisma.round.create({
      data: {
        roundNumber,
        player1Choice,
        player2Choice,
        winner,
        gameId
      }
    });

    res.status(201).json(round);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL GAMES
export const getAllGames = async (req, res) => {
  const games = await prisma.game.findMany({
    include: { rounds: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(games);
};

// GET GAME BY ID
export const getGameById = async (req, res) => {
  const game = await prisma.game.findUnique({
    where: { id: Number(req.params.id) },
    include: { rounds: true }
  });
  res.json(game);
};

// GAME STATS
export const getGameStats = async (req, res) => {
  const stats = await prisma.game.aggregate({
    _count: true,
    _avg: {
      player1Score: true,
      player2Score: true
    }
  });
  res.json(stats);
};
