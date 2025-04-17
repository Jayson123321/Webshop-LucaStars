import { OrderItem } from "./OrderItem";

export type ShoppingCartItem = {
    id: number;
    orderItem: OrderItem;
    amount:number;
};