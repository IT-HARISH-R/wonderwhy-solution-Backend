import Game from './Game.js';
import Round from './Round.js';

// Define associations
Game.hasMany(Round, { foreignKey: 'gameId', as: 'Rounds' });
Round.belongsTo(Game, { foreignKey: 'gameId', as: 'Game' });

// Export all models together
export { Game, Round };
