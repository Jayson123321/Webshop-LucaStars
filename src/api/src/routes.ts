/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { OrderItemController } from "./controllers/OrderItemController";
import { DatabaseController } from "./controllers/DatabaseController";
import bodyParser from "body-parser";
import { CustomJwtPayload } from "./types/jwt";
import jwt from "jsonwebtoken";

export const router: Router = Router();

const asyncHandler: (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => (req: Request, res: Response, next: NextFunction) => void = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const databaseController: DatabaseController = DatabaseController.getInstance();
const userController: UserController = new UserController(databaseController);
const orderItemController: OrderItemController = new OrderItemController();

router.get("/", (_, res) => {
    res.send("Hello, this is a simple webshop API.");
});

router.post(
    "/users/token",
    asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        const user: any = await databaseController.getUserByEmail(email);

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const payload: CustomJwtPayload = { userId: user.user_id };
        const token: any = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ token });
        res.json({ message: "Token created successfully" });
    }),
);

router.post(
    "/users/email",
    asyncHandler(async (req: Request, res: Response) => {
        await userController.sendEmail(req, res);
    }),
);

router.post(
    "/users/register",
    asyncHandler(async (req, res) => {
        await userController.register(req, res);
    }),
);

router.post(
    "/users/login",
    asyncHandler(async (req, res) => {
        await userController.login(req, res);
    }),
);

router.use(
    "/product/games",
    (req, res) => {
        const index: number = req.url.indexOf("games");
        const query: string = req.url.substring(index+1);
        res.redirect(301, "/products/games" + query);
    },
);

router.get(
    "/products/games",
    asyncHandler(async (req, res) => {
        await orderItemController.getAllGames(req, res);
    }),
);

router.use(
    "/product/merchandise",
    (req, res) => {
        const index: number = req.url.indexOf("merchandise");
        const query: string = req.url.substring(index+1);
        res.redirect(301, "/products/merchandise" + query);
    },
);

router.get(
    "/products/merchandise",
    asyncHandler(async (req, res) => {
        await orderItemController.getAllMerchandise(req, res);
    }),
);

router.use(
    "/item",
    (_req, res) => {
        res.redirect(301, "/items");
    },
);

router.get(
    "/items",
    asyncHandler(async (req, res) => {
        await orderItemController.getAllGames(req, res);
    }),
);


router.post(
    "/users/reset-password",
    asyncHandler(async (req: Request, res: Response) => {
        const { token, password } = req.body;

        const result: boolean = await userController.resetPassword(token, password);

        if (result) {
            res.status(200).json({ message: "Password reset successfully" });
        } else {
            res.status(400).json({ message: "Failed to reset password" });
        }
    }),
);

router.post(
    "/users/setToken",
    asyncHandler(async (req: Request, res: Response) => {
        await databaseController.setToken(req.body.user_id, req.body.token);
        res.status(200).send("Token set successfully");
    }),
);

router.get(
    "/users/email/:email",
    asyncHandler(async (req: Request, res: Response) => {
        const email: string = req.params.email;
        const user: any = await databaseController.getUserByEmail(email);
        const exists: boolean = user !== undefined;
        const user_id: number | null = user ? user.user_id : null;
        res.json({ exists, user_id });
    }),
);

// NOTE: Everything after this point only works with a valid JWT token!
router.use((req, res, next): any => {
    return handleTokenBasedAuthentication(req, res, next);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/users/logout", (req, res) => {
    userController.logout(req, res);
});

router.get(
    "/users/hello",
    asyncHandler(async (req, res) => {
        await userController.hello(req, res);
    }),
);

router.post("/users/cart/:id", (req, res) => void userController.addOrderItemToCart(req, res));

router.delete("/users/shoppingcart/:id", (req, res) => void userController.removeOrderItemFromCart(req, res));

router.get("/users/items", (req, res) => userController.getIdAndAmount(req, res));

router.get("/users/cartItems", (req, res) => void userController.getCartItems(req, res));

router.post("/users/shippingDetails", (req, res) => void userController.shippingDetails(req, res));
router.get("/users/getShippingDetails", (req, res) => void userController.getShippingDetails(req, res));
router.put("/users/updateShippingDetails", (req, res) => void userController.updateShippingDetails(req, res));

router.get("/users/profile", (req, res) => void userController.getProfileDetails(req, res));
router.delete("/users/deleteProfile", (req, res) => void userController.deleteUser(req, res));
