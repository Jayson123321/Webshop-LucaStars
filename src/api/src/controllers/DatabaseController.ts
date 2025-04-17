import { Address } from "@shared/types/index.js";
import { pool } from "../service/dbpool.js";

export class DatabaseController {
    private static instance: DatabaseController;

    public static getInstance(): DatabaseController {
        if (!DatabaseController.instance) {
            DatabaseController.instance = new DatabaseController();
        }
        return DatabaseController.instance;
    }

    public async retrieveUser(email: string): Promise<boolean> {
        console.log("Retrieving user with email: ", email);
        const query: string = "SELECT * FROM users WHERE email = ?";
        const result: any[] = await this.queryDatabase(query, [email]);
        return result.length > 0;
    }

    public async setToken(user_id: number, token: string): Promise<void> {
        console.log("Setting token for user with user_id: ", user_id);
        const query: string = "INSERT INTO password_resets (expires_at, user_id, token) VALUES (?, ?, ?)";
        const expiresAt: Date = new Date();
        expiresAt.setHours(expiresAt.getHours() + 3);
        const formattedExpiresAt: any = expiresAt.toISOString().slice(0, 19).replace("T", " ");
        await this.queryDatabase(query, [formattedExpiresAt, user_id, token]);
    }

    public async getUserByToken(token: string): Promise<any> {
        console.log("Getting user by token: ", token);
        const query: string = "SELECT user_id FROM password_resets WHERE token = ?";
        const result: any[] = await this.queryDatabase(query, [token]);
        return result.length > 0 ? result[0] : undefined;
    }

    public async updatePassword(user_id: number, password: string): Promise<void> {
        console.log("Updating password for user with user_id: ", user_id);
        const query: string = "UPDATE users SET password = ? WHERE user_id = ?";
        await this.queryDatabase(query, [password, user_id]);
    }

    public async createUser(user: any): Promise<void> {
        try {
            console.log("Creating user: ", user);

            const userQuery: string = "INSERT INTO users (email, password, username) VALUES (?, ?, ?)";
            const userResult: any = await this.queryDatabase(userQuery, [
                user.email,
                user.password,
                user.username,
            ]);

            const userId: number = userResult.insertId;
            console.log("Newly created user ID: ", userId);

            const profileQuery: string = `
            INSERT INTO profile (user_id, gender, street, house_number, country, date_of_birth)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
            await this.queryDatabase(profileQuery, [
                userId,
                user.gender,
                user.street,
                user.houseNumber,
                user.country,
                user.dateOfBirth,
            ]);

            console.log("User profile created successfully");
        } catch (error) {
            console.error("Error creating user or profile: ", error);
            throw error;
        }
    }

    public async getUserByUsername(username: string, password: string): Promise<any> {
        const query: string =
            "SELECT user_id, username, email FROM users WHERE username = ? AND password = ?";
        return this.queryDatabase(query, [username, password]);
    }

    public async getUserByEmail(email: string): Promise<any> {
        const query: string = "SELECT * FROM users WHERE email = ?";
        const result: any[] = await this.queryDatabase(query, [email]);
        return result.length > 0 ? result[0] : undefined;
    }

    public async getCompleteUserByEmail(email: string): Promise<any> {
        const query: string = "SELECT * FROM users WHERE email = ?";
        const user: any[] = await this.queryDatabase(query, [email]);
        return user;
    }

    public async getUserById(userId: number): Promise<any> {
        const query: string = "SELECT * FROM users WHERE user_id = ?";
        const results: any = await this.queryDatabase(query, [userId]);
        return results.length > 0 ? results[0] : null; // Assuming user_id is unique and results[0] is the user object
    }
    

    public async getGamesFromDB(orderBy: string, sortOrder: string): Promise<any> {
        let query: string = "SELECT * FROM products";
        if (orderBy === "name") {
            if (sortOrder === "Asc") {
                query += " ORDER BY products.title ASC";
            }
            if (sortOrder === "Desc") {
                query += " ORDER BY products.title DESC";
            }
        }
        if (orderBy === "price") {
            if (sortOrder === "Asc") {
                query += " ORDER BY products.price ASC";
            }
            if (sortOrder === "Desc") {
                query += " ORDER BY products.price DESC";
            }
        }
        if (orderBy === "rating") {
            if (sortOrder === "Highlighted") {
                query += " WHERE products.tags LIKE '%Highlighted%'";
            }
            if (sortOrder === "Runner-up") {
                query += " WHERE products.tags LIKE '%Runner-up%'";
            }
            if (sortOrder === "Highlighted-Runner-up") {
                query += " WHERE products.tags REGEXP 'Highlighted|Runner-up' ORDER BY products.tags ASC";
            }
            if (sortOrder === "Runner-up-Highlighted") {
                query += " WHERE products.tags REGEXP 'Highlighted|Runner-up' ORDER BY products.tags DESC";
            }
        }
        if (orderBy === "genre") {
            if (sortOrder === "Action") {
                query += " WHERE products.genre REGEXP 'Action'";
            }
            if (sortOrder === "Adventure") {
                query += " WHERE products.genre REGEXP 'Adventure'";
            }
            if (sortOrder === "Horror") {
                
                query += " WHERE products.genre REGEXP 'Horror'"; 
            }
            if (sortOrder === "Comedy") {
                query += " WHERE products.genre REGEXP 'Comedy'";
            }
            if (sortOrder === "Drama") {
                query += " WHERE products.genre REGEXP 'Drama'";
            }
            if (sortOrder === "Sci-Fi") {   
                query += " WHERE products.genre REGEXP 'Sci-Fi'";  
            }
            if (sortOrder === "Mystery") {
                query += " WHERE products.genre REGEXP 'Mystery'";   
            } 
        }
        return this.queryDatabase(query);
    }

    public async getMerchandiseFromDB(orderBy: string, sortOrder: string): Promise<any> {
        let query: string = "SELECT * FROM merchandise";
        if (orderBy === "name") {
            if (sortOrder === "Asc") {
                query += " ORDER BY merchandise.title ASC";
            }
            if (sortOrder === "Desc") {
                query += " ORDER BY merchandise.title DESC";
            }
        }
        if (orderBy === "price") {
            if (sortOrder === "Asc") {
                query += " ORDER BY merchandise.price ASC";
            }
            if (sortOrder === "Desc") {
                query += " ORDER BY merchandise.price DESC";
            }
        }
        if (orderBy === "rating") {
            if (sortOrder === "Highlighted") {
                query += " WHERE merchandise.tags LIKE '%Highlighted%'";
            }
            if (sortOrder === "Runner-up") {
                query += " WHERE merchandise.tags LIKE '%Runner-up%'";
            }
            if (sortOrder === "Highlighted-Runner-up") {
                query += " WHERE merchandise.tags REGEXP 'Highlighted|Runner-up' ORDER BY merchandise.tags ASC";
            }
            if (sortOrder === "Runner-up-Highlighted") {
                query += " WHERE merchandise.tags REGEXP 'Highlighted|Runner-up' ORDER BY merchandise.tags DESC";
            }
        }
        if (orderBy === "genre") {
            if (sortOrder === "Action") {
                query += " WHERE merchandise.genre REGEXP 'Action'";
            }
            if (sortOrder === "Adventure") {
                query += " WHERE merchandise.genre REGEXP 'Adventure'";
            }
            if (sortOrder === "Horror") {
                
                query += " WHERE merchandise.genre REGEXP 'Horror'"; 
            }
            if (sortOrder === "Comedy") {
                query += " WHERE merchandise.genre REGEXP 'Comedy'";
            }
            if (sortOrder === "Drama") {
                query += " WHERE merchandise.genre REGEXP 'Drama'";
            }
            if (sortOrder === "Sci-Fi") {   
                query += " WHERE merchandise.genre REGEXP 'Sci-Fi'";  
            }
            if (sortOrder === "Mystery") {
                query += " WHERE merchandise.genre REGEXP 'Mystery'";   
            } 
        }
        return this.queryDatabase(query);
    }

    public async testConnection(): Promise<void> {
        const query: string = "SELECT 1";
        await this.queryDatabase(query);
        console.log("Database connection successful");
    }
    public async addOrderItemToCart(
        productId: number,
        amount: number,
        name: string,
        price: number,
        userId: number,
    ): Promise<void> {
        const query: string = "INSERT INTO cart (id, amount, name, price, user_id) VALUES (?, ?, ?, ?, ?)";
        const params: any[] = [productId, amount, name, price, userId];

        await this.queryDatabase(query, params);
    }
    public async removeOrderItemFromCart(productId: number, userId: number): Promise<void> {
        const query: string = "DELETE FROM cart WHERE id = ? AND user_id = ?";
        await this.queryDatabase(query, [productId, userId]);
    }
    public async getCartItems(userId: number): Promise<any> {
        const query: string = "SELECT * FROM cart WHERE user_id = ?";
        return this.queryDatabase(query, [userId]);
    }
    public async shippingDetails(
        payment_method: string,
        street: string,
        country: string,
        zip: string,
        city: string,
        userId: number,
    ): Promise<void> {
        const query: string =
            "INSERT INTO shippingdetails (payment_method, street, country, zip, city, user_id) VALUES (?, ?, ?, ?, ?, ?)";
        await this.queryDatabase(query, [payment_method, street, country, zip, city, userId]);
    }
    public async checkIfUserShippingDetailsExist(userId: number): Promise<boolean> {
        const query: string = "SELECT * FROM shippingdetails WHERE user_id = ?";
        const results: Address[] = await this.queryDatabase(query, [userId]);
        return results.length > 0;
    }
    
    public async deleteUser(userId: number): Promise<boolean> {
        try {
            const queryOne: string = "DELETE FROM profile WHERE user_id = ?";
            const queryTwo: string = "DELETE FROM users WHERE user_id = ?";
            
            await this.queryDatabase(queryOne, [userId]);
            await this.queryDatabase(queryTwo, [userId]);
            return true; // Geen fout opgetreden tijdens de uitvoering van de query
        } catch (error) {
            console.error("Error deleting user:", error);
            return false; // Een fout is opgetreden tijdens de uitvoering van de query
        }
    }
    
    public async updateShippingDetails(
        payment_method: string,
        street: string,
        country: string,
        zip: string,
        city: string,
        userId: number,
    ): Promise<void> {
        const query: string =
            "UPDATE shippingdetails SET payment_method = ?, street = ?, country = ?, zip = ?, city = ? WHERE user_id = ?";
        await this.queryDatabase(query, [payment_method, street, country, zip, city, userId]);
    }
    public async getShippingDetails(userId: number): Promise<Address> {
        const query: string = "SELECT * FROM shippingdetails WHERE user_id = ?";
        const result: Address = await this.queryDatabase(query, [userId]);
        return result;
    }

    public async getProfileDetails(userId: number): Promise<any>{
        const query: string = "SELECT username, email FROM users WHERE user_id = ?";
        const result: any = await this.queryDatabase(query, [userId]);
        return result;
    }

    private async queryDatabase<T = any>(query: string, values: any[] = []): Promise<T> {
        let connection: any;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.query(query, values);
            return results as T;
        } catch (error) {
            console.error("Database query error:", error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

async function main(): Promise<void> {
    const dbController: DatabaseController = DatabaseController.getInstance();
    try {
        await dbController.testConnection();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}


main().catch((error) => {
    console.error("An error occurred during initialization:", error);
});



