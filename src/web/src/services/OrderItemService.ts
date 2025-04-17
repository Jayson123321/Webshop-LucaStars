import { OrderItem } from "@shared/types";

/**
 * Handles order item related functionality
 */
export class OrderItemService {
    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getAll(): Promise<OrderItem[] | undefined> {

        const dynamicPath: string = `${viteConfiguration.API_URL}item`;

        const response: Response = await fetch(dynamicPath, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

}
