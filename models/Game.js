import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Game = sequelize.define("Game", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  player1Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  player2Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  player1Score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  player2Score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tieRounds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  gameWinner: {
    type: DataTypes.ENUM("player1", "player2", "tie"),
    allowNull: true
  }
}, {
  timestamps: true
});

export default Game;
