import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Game from "./Game.js";

const Round = sequelize.define("Round", {
  roundNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  player1Choice: {
    type: DataTypes.ENUM("stone", "paper", "scissors"),
    allowNull: false
  },
  player2Choice: {
    type: DataTypes.ENUM("stone", "paper", "scissors"),
    allowNull: false
  },
  winner: {
    type: DataTypes.ENUM("player1", "player2", "tie"),
    allowNull: false
  }
});

Game.hasMany(Round, { onDelete: "CASCADE" });
Round.belongsTo(Game);

export default Round;
