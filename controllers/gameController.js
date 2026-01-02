import Game from '../models/Game.js';

// Create a new game with player names
export const createGame = async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    
    if (!player1Name || !player2Name) {
      return res.status(400).json({ 
        message: 'Player names are required' 
      });
    }

    const game = new Game({
      player1Name,
      player2Name,
      rounds: [],
      player1Score: 0,
      player2Score: 0,
      tieRounds: 0
    });

    await game.save();
    
    res.status(201).json({
      message: 'Game created successfully',
      gameId: game._id,
      player1Name: game.player1Name,
      player2Name: game.player2Name
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Play a single round
export const playRound = async (req, res) => {
  try {
    const { gameId, roundNumber, player1Choice, player2Choice } = req.body;
    
    if (!gameId || !roundNumber || !player1Choice || !player2Choice) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ 
        message: 'Game not found' 
      });
    }

    // Check if round already exists
    const existingRound = game.rounds.find(r => r.roundNumber === roundNumber);
    if (existingRound) {
      return res.status(400).json({ 
        message: 'Round already played' 
      });
    }

    // Determine winner for this round
    const winner = game.determineWinner(player1Choice, player2Choice);
    
    // Create round object
    const round = {
      roundNumber,
      player1Choice,
      player2Choice,
      winner
    };

    // Update game scores
    if (winner === 'player1') {
      game.player1Score += 1;
    } else if (winner === 'player2') {
      game.player2Score += 1;
    } else {
      game.tieRounds += 1;
    }

    // Add round to game
    game.rounds.push(round);

    // If this is the 6th round, determine overall winner
    if (roundNumber === 6) {
      if (game.player1Score > game.player2Score) {
        game.gameWinner = 'player1';
      } else if (game.player2Score > game.player1Score) {
        game.gameWinner = 'player2';
      } else {
        game.gameWinner = 'tie';
      }
    }

    await game.save();
    
    res.status(200).json({
      message: 'Round played successfully',
      round,
      scores: {
        player1: game.player1Score,
        player2: game.player2Score,
        ties: game.tieRounds
      },
      gameWinner: game.gameWinner,
      totalRounds: game.rounds.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get single game by ID
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const game = await Game.findById(id).select('-__v');
    
    if (!game) {
      return res.status(404).json({ 
        message: 'Game not found' 
      });
    }
    
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get game history/statistics
export const getGameStats = async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const totalRounds = await Game.aggregate([
      { $unwind: '$rounds' },
      { $count: 'totalRounds' }
    ]);
    
    const playerWins = await Game.aggregate([
      { $group: {
        _id: '$gameWinner',
        count: { $sum: 1 }
      }}
    ]);
    
    res.status(200).json({
      totalGames,
      totalRounds: totalRounds[0]?.totalRounds || 0,
      playerWins
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};