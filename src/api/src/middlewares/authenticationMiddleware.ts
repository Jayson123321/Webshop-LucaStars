import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtToken } from "../types/jwt";
import { DatabaseController } from "../controllers/DatabaseController";

/**
 * Handles token-based authentication. If the token is valid, the user object is added to the request object.
 * If the token is invalid, a 401 error is returned.
 *
 * @param req - Request object
 * @param res - Response object
 *
 * @returns NextFunction | Status 401
 */
export async function handleTokenBasedAuthentication(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<NextFunction | void> {
    const authenticationToken: string | undefined = req.headers["authorization"];
    const databaseController: DatabaseController = DatabaseController.getInstance();

    // Check if there is a token
    if (!authenticationToken) {
        res.status(401).send("Unauthorized");
        return;
    }

    // Check if the token is valid
    let jwtToken: CustomJwtToken | undefined;

    try {
        jwtToken = jwt.verify(authenticationToken, process.env.JWT_SECRET_KEY) as CustomJwtToken;
    } catch {
        res.status(401).send("Unauthorized");
        return;
    }

    if (!jwtToken) {
        res.status(401).send("Unauthorized");
        return;
    }

    // Retrieve user from the database
    try {
        const user: any = await databaseController.getUserById(jwtToken.userId);
        if (!user) {
            res.status(401).send("Unauthorized");
            return;
        }
        req.user = user;
        return next();
    } catch (error) {
        res.status(500).send("Internal Server Error");
        return;
    }
}
