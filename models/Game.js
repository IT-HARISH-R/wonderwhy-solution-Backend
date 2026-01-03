import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js'; 


const Game = sequelize.define('Game', {
  player1Name: { type: DataTypes.STRING, allowNull: false },
  player2Name: { type: DataTypes.STRING, allowNull: false },
  player1Score: { type: DataTypes.INTEGER, defaultValue: 0 },
  player2Score: { type: DataTypes.INTEGER, defaultValue: 0 },
  tieRounds: { type: DataTypes.INTEGER, defaultValue: 0 },
  gameWinner: { type: DataTypes.STRING }
}, {
  tableName: 'games'
});

export default Game;
