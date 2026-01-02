const getWinner = (p1, p2) => {
  if (p1 === p2) return "tie";

  if (
    (p1 === "stone" && p2 === "scissors") ||
    (p1 === "scissors" && p2 === "paper") ||
    (p1 === "paper" && p2 === "stone")
  ) {
    return "player1";
  }

  return "player2";
};

export default getWinner;
