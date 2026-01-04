// controllers/gameController.js
import prisma from "../prismaClient.js";

// ======================= CREATE GAME =======================
export const createGame = async (req, res) => {
  try {
    const game = await prisma.game.create({
      data: {
        player1Name: req.body.player1Name,
        player2Name: req.body.player2Name
      },
      include: {
        rounds: true // include empty rounds array initially
      }
    });
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================= PLAY ROUND =======================
export const playRound = async (req, res) => {
  const { gameId, roundNumber, player1Choice, player2Choice } = req.body;

  try {
    // 1️⃣ Calculate winner
    let winner = null;
    if (player1Choice === player2Choice) winner = null; // tie
    else if (
      (player1Choice === "stone" && player2Choice === "scissors") ||
      (player1Choice === "scissors" && player2Choice === "paper") ||
      (player1Choice === "paper" && player2Choice === "stone")
    ) {
      winner = "player1";
    } else {
      winner = "player2";
    }

    console.log("Winner calculated:", winner);

    // 2️⃣ Save round in DB
    const round = await prisma.round.create({
      data: {
        roundNumber,
        player1Choice,
        player2Choice,
        winner: winner || null,
        game: { connect: { id: gameId } },
      }
    });

    // 3️⃣ Update game scores
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { rounds: true }
    });

    let player1Score = 0;
    let player2Score = 0;
    let ties = 0;

    game.rounds.forEach(r => {
      if (r.winner === "player1") player1Score++;
      else if (r.winner === "player2") player2Score++;
      else ties++;
    });

    // 4️⃣ Determine game winner if 6 rounds done
    let gameWinner = null;
    if (game.rounds.length === 6) {
      if (player1Score > player2Score) gameWinner = "player1";
      else if (player2Score > player1Score) gameWinner = "player2";
      else gameWinner = "tie";
    }

    // 5️⃣ Return response
    res.status(201).json({
      round,
      scores: { player1: player1Score, player2: player2Score, ties },
      gameWinner
    });

  } catch (err) {
    console.error("Error in playRound:", err);
    res.status(500).json({ error: err.message });
  }
};

// ======================= GET ALL GAMES =======================
export const getAllGames = async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: { rounds: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================= GET GAME BY ID =======================
export const getGameById = async (req, res) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: Number(req.params.id) },
      include: { rounds: true }
    });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
