import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Round = sequelize.define('Round', {
  roundNumber: { type: DataTypes.INTEGER, allowNull: false },
  player1Choice: { type: DataTypes.STRING, allowNull: false },
  player2Choice: { type: DataTypes.STRING, allowNull: false },
  winner: { type: DataTypes.STRING }
}, {
  tableName: 'rounds'
});

export default Round;
