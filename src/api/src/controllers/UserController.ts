import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Address, OrderItem, UserData } from "@shared/types";
import { ShoppingCartItem, UserLoginFormModel, UserRegisterFormModel } from "@shared/formModels";
import { CustomJwtPayload } from "../types/jwt";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { DatabaseController } from "./DatabaseController";

//import { api } from "@hboictcloud/api";
//import "../service/config";

const databaseController: DatabaseController = DatabaseController.getInstance();

/**
 * Handles all endpoints related to the User resource
 */
export class UserController {
    private databaseController: DatabaseController;

    public constructor(databaseController: DatabaseController) {
        this.databaseController = databaseController;
    }
    /**
     * Register a user using {@link UserRegisterFormModel}
     *
     * Returns a 200 with a message when successful.
     * Returns a 400 with a message detailing the reason otherwise.
     *
     * @param req Request object
     * @param res Response object
     */
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const formModel: UserRegisterFormModel = req.body as UserRegisterFormModel;

            // Log the received formModel
            console.log("Received formModel: ", formModel);

            if (
                !formModel.email ||
                !formModel.password ||
                !formModel.username ||
                !formModel.gender ||
                !formModel.street ||
                !formModel.houseNumber ||
                !formModel.country
            ) {
                res.status(400).json({ error: "All fields are required." });
                return;
            }

            const existingUser: boolean = await this.databaseController.retrieveUser(formModel.email);
            console.log("does user exist? ", existingUser);

            if (existingUser) {
                res.status(400).json({ message: "This email address is already used." });
                return;
            }

            const hashedPassword: string = bcrypt.hashSync(formModel.password, 10);

            const user: UserRegisterFormModel = {
                email: formModel.email,
                password: hashedPassword,
                username: formModel.username,
                gender: formModel.gender,
                street: formModel.street,
                houseNumber: formModel.houseNumber,
                country: formModel.country,
                dateCreated: new Date().toISOString().split("T")[0],
                dateOfBirth: formModel.dateOfBirth,
            };

            console.log("Creating user with data: ", user);

            await this.databaseController.createUser(user);
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error during registration: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    public async generateJwtToken(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;
            const user: UserData[] = await databaseController.getUserByEmail(email);

            if (user.length === 0) {
                res.status(400).json({ message: "User not found" });
                return;
            }

            const payload: CustomJwtPayload = { userId: user[0].user_id };
            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

            res.status(200).json({ token });
        } catch (error) {
            console.error("Error generating JWT token:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async resetPassword(token: string, password: string): Promise<boolean> {
        try {
            const { user_id: userId } = await databaseController.getUserByToken(token);

            if (!userId) {
                return false;
            }

            const hashedPassword: string = bcrypt.hashSync(password, 10);
            await databaseController.updatePassword(userId, hashedPassword);

            return true;
        } catch (error) {
            console.error("Error resetting password:", error);
            return false;
        }
    }

    /**
     * Send an email to a user
     *
     * Returns a 200 with a message when successful.
     * Returns a 500 with a message detailing the reason otherwise.
     *
     * @param req Request object
     * @param res Response object
     */
    public async sendEmail(req: Request, res: Response): Promise<void> {
        const { email, resetLink } = req.body;
        try {
            // Fetch user details
            const user: any = await databaseController.getUserByEmail(email);

            if (!user) {
                res.status(400).json({ message: "User not found" });
                return;
            }

            const { username } = user;

            console.log({
                from: {
                    name: "Lucastars Webshop Inc.",
                    address: "group@fys.cloud",
                },
                to: [
                    {
                        name: username,
                        address: email,
                    },
                ],
                subject: "Forgot password link",
                html: `<h1>Promise you me won't forget it again, ${username}!</h1><p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in one hour.</p>`,
            });
            const data: any = ""; //await api.sendEmail({
            //     from: {
            //         name: "Lucastars Webshop Inc.",
            //         address: "group@fys.cloud",
            //     },
            //     to: [
            //         {
            //             name: username,
            //             address: email,
            //         },
            //     ],
            //     subject: "Forgot password link",
            //     html: `<h1>Promise you me won't forget it again, ${username}!</h1><p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in one hour.</p>`,
            // });

            console.log(data);
            res.status(200).json({ message: "Email sent successfully" });
        } catch (reason) {
            console.log(reason);
            res.status(500).json({ message: "Failed to send email" });
        }
    }

    /**
     * Login a user using a {@link UserLoginFormModel}
     *
     * Returns a 200 with a message when successful.
     * Returns a 400 with a message detailing the reason otherwise.
     *
     * @param req Request object
     * @param res Response object
     */
    public async login(req: Request, res: Response): Promise<void> {
        const formModel: UserLoginFormModel = req.body as UserLoginFormModel;
        console.log("formmodel password: ", formModel.password);

        // TODO: Validate empty email/password

        // Retrieve user from the database
        const user: UserData[] = await databaseController.getCompleteUserByEmail(formModel.email);
        console.log("db password: ", user[0]);
        console.log("userid: ", user[0].user_id);
        if (!user) {
            res.status(400).json({ message: "User not found" });

            return;
        }

        const passwordMatch: boolean = bcrypt.compareSync(formModel.password, user[0].password);

        if (!passwordMatch) {
            res.status(400).json({ message: "Incorrect password" });

            return;
        }

        // Generate a JWT Token
        const payload: CustomJwtPayload = { userId: user[0].user_id };

        console.log("keigeheime sleutel: ", process.env.JWT_SECRET_KEY);

        const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        const decoded: CustomJwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY) as CustomJwtPayload;
        console.log("decoded: ", decoded);

        res.json({ token });
    }

    public addItemToShoppingcart(req: Request, res: Response): void {
        const shoppingCartItem: ShoppingCartItem = req.body;
        if (!shoppingCartItem.amount || shoppingCartItem.amount <= 0) {
            res.status(400).json({ error: "Amount must be a positive number" });
            return;
        }

        const orderItem: OrderItem = shoppingCartItem.orderItem;
        if (!orderItem || !orderItem.id || !orderItem.title || !orderItem.price) {
            res.status(400).json({ error: "Order item is incomplete" });
            return;
        }

        const shoppingCartItems: ShoppingCartItem[] = [];
        shoppingCartItems.push(shoppingCartItem);

        res.status(200).json({ message: "Item has been successfully added to the shopping cart" });
    }

    /**
     * Logout a user using a valid JWT token
     *
     * Always a returns a 200 signaling success
     *
     * @param _ Request object (unused)
     * @param res Response object
     */
    public logout(_: Request, res: Response): void {
        // TODO: Optional, but revoke the JWT Token.

        res.json({
            message: "You are logged out.",
        });
    }

    /**
     * Temporary method to return some data about a user with a valid JWT token
     *
     * Always a returns a 200 with {@link UserHelloResponse} as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public async hello(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ error: "User not authenticated" });
            console.log("User not authenticated");
            return;
        }

        const userId: number = req.user.user_id;
        console.log(req.user);
        const orderItems: OrderItem[] = await databaseController.getGamesFromDB(
            req.query.orderBy as string, 
            req.query.sortOrder as string, 
        );

        try {
            // Make a database call to retrieve user data
            const userData: UserData = await databaseController.getUserById(userId);

            const cartItemNames: string[] | undefined = userData.cart?.map((e) => {
                const orderItem: OrderItem | undefined = orderItems.find((f) => f.id === e.id);
                return orderItem ? orderItem.title : "";
            });

            const response: UserHelloResponse = {
                email: userData.email,
                cartItems: cartItemNames,
            };

            res.json(response);
        } catch (error: any) {
            console.error(`Failed to retrieve user data: ${error.toString()}`);
            res.status(500).json({ error: "Failed to retrieve user data" });
        }
    }

    /**
     * Add a order item to the cart of the user
     *
     * Always a returns a 200 with the total number of order items in the cart as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public async addOrderItemToCart(req: Request, res: Response): Promise<void> {
      //  res.json({message: "Test enpoint addOrderItemToCart"});
        const userData: UserData = req.body;
        const productId: number = parseInt(req.params.id);
        const user: UserData = req.user as UserData;
        const userId: number = user.user_id;
        console.log("User id: ", userId);
        const name: string = req.body.name;
        const price: number = req.body.price;

        console.log(price);

        const databaseQuery: any = await databaseController.addOrderItemToCart(
            productId,
            1,
            name,
            price,
            userId,
        );
        console.log(databaseQuery);

        // Maak userData.cart leeg
        userData.cart = [];

        // Haal items op uit de database en voeg ze toe aan userData.cart
        const userCartItemsFromDb: any = await databaseController.getCartItems(userId);
        console.log(userCartItemsFromDb);

        userCartItemsFromDb.forEach((item: any) => {
            userData.cart ??= [];
            userData.cart.push({
                id: item.id,
                amount: 1,
                name: item.name,
                price: item.price,
            });
        });

        console.log(userData.cart);

        res.json({ count: userData.cart.length });
    }

    public async getCartItems(req: Request, res: Response): Promise<void> {
      //  res.json({ message: "Test enpoint cartitems"});
        const user: UserData = req.user as UserData;
        const userId: number = user.user_id;
        const cartItems: any = await databaseController.getCartItems(userId);
        res.json(cartItems);
    }

    public getIdAndAmount(req: Request, res: Response): void {
        const userData: UserData = req.user!;

        // Controleer of userData.cart is gedefinieerd
        if (userData.cart) {
            const idAndAmountArray: any = userData.cart.map((item) => ({
                id: item.id,
                amount: item.amount,
                price: item.price,
            }));

            res.json(idAndAmountArray);
        } else {
            res.json([]);
        }
    }

    public async removeOrderItemFromCart(req: Request, res: Response): Promise<void> {
        const productId: number = parseInt(req.params.id);
        console.log(productId);
        const user: UserData = req.user as UserData;
        const userId: number = user.user_id;
        await databaseController.removeOrderItemFromCart(productId, userId);
        res.json({ message: "Item has been successfully removed from the shopping cart" });
    }

    public async shippingDetails(req: Request, res: Response): Promise<void> {
        try {
            const address: Address = req.body;
            const user: UserData = req.user as UserData;
            const userId: number = user.user_id;
            console.log("Address:", address);

            // Controleert of de gebruiker al verzendgegevens heeft ingevuld
            const userHasShippingDetails: boolean =
                await databaseController.checkIfUserShippingDetailsExist(userId);

            if (userHasShippingDetails) {
                console.log("Je hebt al verzendgegevens ingevuld, je kunt ze later aanpassen.");
                res.status(400).json({
                    message: "Je hebt al verzendgegevens ingevuld, je kunt ze later aanpassen.",
                });
            } else {
                await databaseController.shippingDetails(
                    address.payment_method,
                    address.street,
                    address.country,
                    address.zip,
                    address.city,
                    userId,
                );
                res.status(200).json({ message: "Verzendgegevens ontvangen", address });
            }
        } catch (error) {
            console.error("Error adding shipping details:", error);
        }
    }

    public async updateShippingDetails(req: Request, res: Response): Promise<void> {
        try {
            const address: Address = req.body;
            const user: UserData = req.user as UserData;
            const userId: number = user.user_id;

            // Check if the user has existing shipping details
            const userHasShippingDetails: boolean =
                await databaseController.checkIfUserShippingDetailsExist(userId);

            if (userHasShippingDetails) {
                await databaseController.updateShippingDetails(
                    address.payment_method,
                    address.street,
                    address.country,
                    address.zip,
                    address.city,
                    userId,
                );

                console.log("Shipping details updated for user:", userId);
                res.status(200).json({ message: "Shipping details updated", address });
            } else {
                console.log("User has not filled shipping details yet, please fill them first.");
                res.status(400).json({
                    message: "User has not filled shipping details yet, please fill them first.",
                });
            }
        } catch (error) {
            console.error("Error updating shipping details:", error);
            res.status(500).json({ message: "Failed to update shipping details" });
        }
    }

    public async getShippingDetails(req: Request, res: Response): Promise<void> {
        try {
            const user: UserData = req.user as UserData;
            const userId: number = user.user_id;
            const shippingDetails: Address = await databaseController.getShippingDetails(userId);
            res.status(200).json(shippingDetails);
        } catch (error) {
            console.error("Error getting shipping details:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public async getProfileDetails(req: Request, res: Response): Promise<void> {
        const user: UserData = req.user as UserData;
        const userId: number = user.user_id;
        const profileDetails: any = await databaseController.getProfileDetails(userId);
        res.status(200).json(profileDetails);
    }
    
    public async deleteUser(req: Request, res: Response): Promise<void> {
        const user: UserData = req.user as UserData;
        const userId: number = user.user_id;
        
        const deleteUser: any = await databaseController.deleteUser(userId);
        res.status(200).json(deleteUser);
    }
     


}
