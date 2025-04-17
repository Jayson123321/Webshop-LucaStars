import { Request, Response } from "express";
import { DatabaseController } from "./DatabaseController";
import { OrderItem } from "@shared/types";

const databaseController: DatabaseController = DatabaseController.getInstance();

/**
 * Handles all endpoints related to the Order Item resource
 */
export class OrderItemController {
    /**
     * Get all order items
     *
     * @param _ Request object (unused)
     * @param res Response object
     */
    public async getAllGames(req: Request, res: Response): Promise<void> {
    
        const orderItems: OrderItem[] = await databaseController.getGamesFromDB(
            req.query.orderBy as string, 
            req.query.sortOrder as string, 
        );
        res.json(orderItems);
    }

    public async getAllMerchandise(req: Request, res: Response): Promise<void> {
    
        const orderItems: OrderItem[] = await databaseController.getMerchandiseFromDB(
            req.query.orderBy as string, 
            req.query.sortOrder as string, 
        );
        res.json(orderItems);
    }
}
