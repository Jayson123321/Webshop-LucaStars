import { OrderItem } from "@shared/types";

/**
 * Handles order item related functionality
 */
export class ProductService {
    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getAllGames(item: OrderItem): Promise<OrderItem[] | undefined> {
        let dynamicPath: string = `${viteConfiguration.API_URL}product/games`;
        if (item.orderBy === "Name") {
            if (item.sortOrder === "Ascending (A-Z)") {
                dynamicPath += "?orderBy=name&sortOrder=Asc";
            }
            if (item.sortOrder === "Descending (Z-A)") {
                dynamicPath += "?orderBy=name&sortOrder=Desc";
            } 
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=name";
            }  
        }
        if (item.orderBy === "Price") { 
            if (item.sortOrder === "Lowest To Highest") {
                dynamicPath += "?orderBy=price&sortOrder=Asc";
            }
            if (item.sortOrder === "Highest To Lowest") {
                dynamicPath += "?orderBy=price&sortOrder=Desc";
            }
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=price";
            }
        }
        if (item.orderBy === "Rating") {
            if (item.sortOrder === "Highlighted") {
                dynamicPath += "?orderBy=rating&sortOrder=Highlighted";
            }
            if (item.sortOrder === "Runner-up") {
                dynamicPath += "?orderBy=rating&sortOrder=Runner-up";
            }
            if (item.sortOrder === "Highlighted And Runner-up") {
                dynamicPath += "?orderBy=rating&sortOrder=Highlighted-Runner-up";
            }
            if (item.sortOrder === "Runner-up And Highlighted") {
                dynamicPath += "?orderBy=rating&sortOrder=Runner-up-Highlighted";
            }
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=rating";
            }
        }
        if (item.orderBy === "Genre") {
            if (item.sortOrder === "Action") {
                dynamicPath += "?orderBy=genre&sortOrder=Action";
            }
            if (item.sortOrder === "Adventure") {
                dynamicPath += "?orderBy=genre&sortOrder=Adventure";
            }
            if (item.sortOrder === "Horror") {
                dynamicPath += "?orderBy=genre&sortOrder=Horror";
            }
            if (item.sortOrder === "Comedy") {
                dynamicPath += "?orderBy=genre&sortOrder=Comedy";
            }
            if (item.sortOrder === "Drama") {
                dynamicPath += "?orderBy=genre&sortOrder=Drama";
            }
            if (item.sortOrder === "Sci-Fi") {
                dynamicPath += "?orderBy=genre&sortOrder=Sci-Fi";
            }
            if (item.sortOrder === "Mystery") {
                dynamicPath += "?orderBy=genre&sortOrder=Mystery";
            }
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=genre";
            }
        }

        const response: Response = await fetch(dynamicPath, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }
    
    public async getAllMerchandise(item: OrderItem): Promise<OrderItem[] | undefined> {
        let dynamicPath: string = `${viteConfiguration.API_URL}product/merchandise`;
        if (item.orderBy === "Name") {
            if (item.sortOrder === "Ascending (A-Z)") {
                dynamicPath += "?orderBy=name&sortOrder=Asc";
            }
            if (item.sortOrder === "Descending (Z-A)") {
                dynamicPath += "?orderBy=name&sortOrder=Desc";
            } 
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=name";
            }  
        }
        if (item.orderBy === "Price") { 
            if (item.sortOrder === "Lowest To Highest") {
                dynamicPath += "?orderBy=price&sortOrder=Asc";
            }
            if (item.sortOrder === "Highest To Lowest") {
                dynamicPath += "?orderBy=price&sortOrder=Desc";
            }
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=price";
            }
        }
        if (item.orderBy === "Rating") {
            if (item.sortOrder === "Highlighted") {
                dynamicPath += "?orderBy=rating&sortOrder=Highlighted";
            }
            if (item.sortOrder === "Runner-up") {
                dynamicPath += "?orderBy=rating&sortOrder=Runner-up";
            }
            if (item.sortOrder === "Highlighted And Runner-up") {
                dynamicPath += "?orderBy=rating&sortOrder=Highlighted-Runner-up";
            }
            if (item.sortOrder === "Runner-up And Highlighted") {
                dynamicPath += "?orderBy=rating&sortOrder=Runner-up-Highlighted";
            }
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=rating";
            }
        }
        if (item.orderBy === "Genre") {
            if (item.sortOrder === "Action") {
                dynamicPath += "?orderBy=genre&sortOrder=Action";
            }
            if (item.sortOrder === "Adventure") {
                dynamicPath += "?orderBy=genre&sortOrder=Adventure";
            }
            if (item.sortOrder === "Horror") {
                dynamicPath += "?orderBy=genre&sortOrder=Horror";
            }
            if (item.sortOrder === "Comedy") {
                dynamicPath += "?orderBy=genre&sortOrder=Comedy";
            }
            if (item.sortOrder === "Drama") {
                dynamicPath += "?orderBy=genre&sortOrder=Drama";
            }
            if (item.sortOrder === "Sci-Fi") {
                dynamicPath += "?orderBy=genre&sortOrder=Sci-Fi";
            }
            if (item.sortOrder === "Mystery") {
                dynamicPath += "?orderBy=genre&sortOrder=Mystery";
            }
            if (item.sortOrder === "Choose") {
                dynamicPath += "?orderBy=genre";
            }
        }

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
