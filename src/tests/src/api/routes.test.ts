import request from "supertest";
import app from "../../../api/src/index";
import { expect, it, describe } from "vitest";
import jwt from "jsonwebtoken"; 

describe("API endpoints", () => {
    it("return a 200 status", async () => {
        // Arrange
        const res: any = await request(app).get("/");

        // Act / Assert
        expect(res.status).toEqual(200);
    });

    it("return a 400 for an invalid login", async () => {
        // Arrange
        process.env.JWT_SECRET_KEY = "supersecretkey";

        const res: any = await request(app)
            .post("/users/login")
            .send({ email: "test@test.nl", password: "testtest" })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        // Act / Assert
        expect(res.status).toEqual(200);
    });

    it("return a 200 for a valid login", async () => {
        // Arrange
        const res: any = await request(app)
            .post("/users/login")
            .send({ email: "test@test.nl", password: "testtest" })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        // Act / Assert
        expect(res.status).toEqual(200);
    });

    it("returns a 200 if item is added to the cart", async () => {
        const userId: number = 1; 
        const jwtSecretKey: string = process.env.JWT_SECRET_KEY;
        const token: any = jwt.sign({ userId: userId }, jwtSecretKey, { expiresIn: "1h" }); // Hier wordt een geldige JWT token gegenereerd

        const res: any = await request(app)
            .post("/users/cart/1") 
            .send({ productId: 1, amount: 1, name: "Test", price: 1, userId: 1})
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", token);

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({message: "Test enpoint addOrderItemToCart"});
    });

    it("returns a 200 if cartItems", async () => {
        const userId: number = 1; 
        const jwtSecretKey: string = process.env.JWT_SECRET_KEY;
        const token: any = jwt.sign({ userId: userId }, jwtSecretKey, { expiresIn: "1h" }); 
        
        const res: any = await request(app)
            .get("/users/cartItems") 
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", token); 

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({message: "Test enpoint cartitems"});
});
    it("returns a 200 if items", async () => {
        
        const res: any = await request(app)
            .get("/items") 
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

<<<<<<< HEAD
 it("returns a 200 if token", async () => {
        const res: any = await request(app)
            .post("/users/token")
            .send({ email: "test@test.nl" })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");
        expect(res.status).toEqual(200);});
});
=======
        // Controleer de response
        expect(res.status).toEqual(200);
});
    it("returns a 200 if products", async () => {
        
        const res: any = await request(app)
            .get("/products") 
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        // Controleer de response
        expect(res.status).toEqual(200);
});

});
>>>>>>> 823927560060d3c4e46a81ab05a9ee425e1bc2b8
