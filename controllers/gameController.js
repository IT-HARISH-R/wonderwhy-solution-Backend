import { Game, Round } from '../models/index.js';
import { determineWinner } from "../utils/gameLogic.js";

export const createGame = async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    if (!player1Name || !player2Name) {
      return res.status(400).json({ message: "Player names required" });
    }
    const game = await Game.create({ player1Name, player2Name });
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const playRound = async (req, res) => {
  try {
    const { gameId, roundNumber, player1Choice, player2Choice } = req.body;

    const game = await Game.findByPk(gameId, { include: { model: Round, as: 'Rounds' } });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const alreadyPlayed = game.Rounds.find(r => r.roundNumber === roundNumber);
    if (alreadyPlayed) return res.status(400).json({ message: "Round already played" });

    const winner = determineWinner(player1Choice, player2Choice);

    const round = await Round.create({
      roundNumber,
      player1Choice,
      player2Choice,
      winner,
      gameId: game.id
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
      round,
      scores: {
        player1: game.player1Score,
        player2: game.player2Score,
        ties: game.tieRounds
      },
      gameWinner: game.gameWinner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({ include: { model: Round, as: 'Rounds' } });
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, { include: { model: Round, as: 'Rounds' } });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGameStats = async (req, res) => {
  try {
    const totalGames = await Game.count();
    const totalRounds = await Round.count();

    const player1Wins = await Game.count({ where: { gameWinner: 'player1' } });
    const player2Wins = await Game.count({ where: { gameWinner: 'player2' } });
    const tieGames = await Game.count({ where: { gameWinner: 'tie' } });

    const playerWins = [
      { _id: 'player1', count: player1Wins },
      { _id: 'player2', count: player2Wins },
      { _id: 'tie', count: tieGames }
    ];

    res.json({ totalGames, totalRounds, playerWins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
