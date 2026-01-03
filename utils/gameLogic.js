export const determineWinner = (p1, p2) => {
  if (p1 === p2) return "tie";

  const rules = {
    stone: "scissors",
    scissors: "paper",
    paper: "stone"
  };

  return rules[p1] === p2 ? "player1" : "player2";
};
