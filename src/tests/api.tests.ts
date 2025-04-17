import  request  from "supertest";
import  app  from "./app";
import { describe, expect, it } from "vitest";
import { Response } from "supertest";

describe("API tests", () => {
it("GET /api/data", async () => {
        const response: Response = await request(app).get("/api/data");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Hello, World!"});
    });
});