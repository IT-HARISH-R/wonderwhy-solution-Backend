import Game from "../models/Game.js";
import Round from "../models/Round.js";
import { determineWinner } from "../utils/gameLogic.js";

export const createGame = async (req, res) => {
  const { player1Name, player2Name } = req.body;

  if (!player1Name || !player2Name) {
    return res.status(400).json({ message: "Player names required" });
  }

  const game = await Game.create({ player1Name, player2Name });
  res.status(201).json(game);
};

export const playRound = async (req, res) => {
  const { gameId, roundNumber, player1Choice, player2Choice } = req.body;

  const game = await Game.findByPk(gameId, { include: Round });
  if (!game) return res.status(404).json({ message: "Game not found" });

  const alreadyPlayed = game.Rounds.find(r => r.roundNumber === roundNumber);
  if (alreadyPlayed) {
    return res.status(400).json({ message: "Round already played" });
  }

  const winner = determineWinner(player1Choice, player2Choice);

  await Round.create({
    roundNumber,
    player1Choice,
    player2Choice,
    winner,
    GameId: game.id
  });

  if (winner === "player1") game.player1Score++;
  else if (winner === "player2") game.player2Score++;
  else game.tieRounds++;

  if (roundNumber === 6) {
    game.gameWinner =
      game.player1Score > game.player2Score ? "player1" :
      game.player2Score > game.player1Score ? "player2" : "tie";
  }

  await game.save();

  res.json({
    message: "Round played successfully",
    scores: {
      player1: game.player1Score,
      player2: game.player2Score,
      ties: game.tieRounds
    },
    gameWinner: game.gameWinner
  });
};

export const getAllGames = async (req, res) => {
  const games = await Game.findAll({ include: Round });
  res.json(games);
};

export const getGameById = async (req, res) => {
  const game = await Game.findByPk(req.params.id, { include: Round });
  if (!game) return res.status(404).json({ message: "Game not found" });
  res.json(game);
};

export const getGameStats = async (req, res) => {
  const totalGames = await Game.count();
  const totalRounds = await Round.count();

  res.json({ totalGames, totalRounds });
};
