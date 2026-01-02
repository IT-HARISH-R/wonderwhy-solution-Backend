import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  player1Choice: {
    type: String,
    enum: ['stone', 'paper', 'scissors'],
    required: true
  },
  player2Choice: {
    type: String,
    enum: ['stone', 'paper', 'scissors'],
    required: true
  },
  winner: {
    type: String,
    enum: ['player1', 'player2', 'tie'],
    required: true
  }
});

const gameSchema = new mongoose.Schema({
  player1Name: {
    type: String,
    required: true,
    trim: true
  },
  player2Name: {
    type: String,
    required: true,
    trim: true
  },
  rounds: [roundSchema],
  player1Score: {
    type: Number,
    default: 0
  },
  player2Score: {
    type: Number,
    default: 0
  },
  tieRounds: {
    type: Number,
    default: 0
  },
  gameWinner: {
    type: String,
    enum: ['player1', 'player2', 'tie'],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to determine round winner
gameSchema.methods.determineWinner = function(p1Choice, p2Choice) {
  if (p1Choice === p2Choice) return 'tie';
  
  const winningConditions = {
    'stone': 'scissors',
    'scissors': 'paper',
    'paper': 'stone'
  };
  
  return winningConditions[p1Choice] === p2Choice ? 'player1' : 'player2';
};

export default mongoose.model('Game', gameSchema);