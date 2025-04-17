import { Address } from "./Address";
import { CartItem } from "./CartItem";
import { Order } from "./Order";

export enum AuthorizationLevel {
    USER = "user",
    EMPLOYEE = "employee",
    ADMIN = "admin",
}

export type UserData = {
    user_id: number;
    email: string;
    password: string;
    name: string;

    firstName?: string;
    lastName?: string;
    addresses?: Address[];
    orders?: Order[];
    authorizationLevel?: AuthorizationLevel;
    cart?: CartItem[];
    dateCreated: Date;
    dateEdited?: Date;
    rememberToken?: string;
};
