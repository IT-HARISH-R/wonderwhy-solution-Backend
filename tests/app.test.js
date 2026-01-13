import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Game API Tests", () => {

  // DB connect before tests
  beforeAll(async () => {
    await prisma.$connect();
  });

  // DB disconnect after tests
  afterAll(async () => {
    await prisma.$disconnect();
  });


  // POST /games → createGame

  describe("POST /api/games", () => {
    it("should create a new game", async () => {
      const res = await request(app)
        .post("/api/games")
        .send({
          player1Name: "Harish",
          player2Name: "Raj"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.player1Name).toBe("Harish");
      expect(res.body.player2Name).toBe("Raj");
      expect(res.body.rounds).toEqual([]);
    });
  });

  // GET /games → getAllGames

  describe("GET /api/games", () => {
    it("should return all games", async () => {
      const res = await request(app)
        .get("/api/games");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

});
