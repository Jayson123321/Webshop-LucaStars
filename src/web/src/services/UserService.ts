import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
import { TokenService } from "./TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { Address, OrderItem } from "@shared/types";
import { profileDetails } from "@shared/types/profile";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles user related functionality
 */
export class UserService {
    private _tokenService: TokenService = new TokenService();

    /**
     * Handles user login
     *
     * @param formData - Data to use during login
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async login(formData: UserLoginFormModel): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/login`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        const json: { token: string | undefined } = await response.json();

        if (json.token) {
            this._tokenService.setToken(json.token);

            return true;
        }

        return false;
    }

    /**
     * Handles user registration
     *
     * @param formData - Data to use during registration
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async register(formData: UserRegisterFormModel): Promise<boolean> {
        const headers: { "Content-Type": string } = {
            "Content-Type": "application/json",
        };

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/register`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    public async getUserId(email: string): Promise<number | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/email/${email}`, {
            method: "get",
            headers: headers,
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        const data: any = await response.json();
        return data.user_id;
    }

    public async checkIfEmailExists(email: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/email/${email}`, {
            method: "get",
            headers: headers,
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        const data: any = await response.json();
        return data.exists;
    }

    /**
     * Handles token generation
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async generateJwtToken(email: string): Promise<{ token: string } | undefined> {
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                console.error("Failed to generate token:", response.status, response.statusText);
                return undefined;
            }

            const data: any = await response.json();
            return data;
        } catch (error) {
            console.error("Error generating token:", error);
            return undefined;
        }
    }

    /**
     * Handles setting a token
     *
     * @param user_id - User ID to use during token setting
     * @param token - Token to use during token setting
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async setToken(user_id: number | undefined, token: string): Promise<void> {
        await fetch(`${viteConfiguration.API_URL}users/setToken`, {
            method: "post",
            headers: headers,
            body: JSON.stringify({ user_id, token }),
        });
    }

    /**
     * Handles user password reset
     *
     * @param formData - Data to use during password reset
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async resetLink(email: string, resetLink: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/email`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, resetLink }),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    /**
     * Handles user password reset
     *
     * @param token - Token to use during password reset
     * @param newPassword - New password to use during password reset
     * @param name - Name to use during password reset
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async resetPassword(token: string, newPassword: string, name: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/reset-password`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, newPassword, name }),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    /**
     * Handles user logout
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async logout(): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/logout`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        return true;
    }

    /**
     * Handles user welcome message containing user and cart data. Requires a valid token.
     *
     * @returns Object with user and cart data when successful, otherwise `undefined`.
     */
    public async getWelcome(): Promise<UserHelloResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/hello`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserHelloResponse;
    }

    /**
     * Handles adding an order item to the cart of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    private selectedItems: { id: number; name: string }[] = [];

    public addToCart(id: number, name: string): void {
        this.selectedItems.push({ id, name });
    }

    public async addOrderItemToCart(
        id: number,
        name: string,
        price: number,
    ): Promise<{ count: number } | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/${id}`, {
                method: "post",
                headers: { ...headers, authorization: token },
                body: JSON.stringify({name: name, id: id, price: price }),
            });
            console.log(response);
            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            const data: any = await response.json();
            return { count: data.count };
        } catch (error) {
            console.error("Error adding item to cart:", error);
            return undefined;
        }
    }

    public async getCartItems(): Promise<OrderItem[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/cartItems`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }
            const data: OrderItem[] = await response.json();

            return data;
        } catch (error) {
            console.error("Error getting cart items:", error);
            return undefined;
        }
    }

    public async getShippingDetails(): Promise<Address[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/getShippingDetails`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            const data: Address[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting shipping details:", error);
            return undefined;
        }
    }

    public async removeOrderItemFromCart(id: number): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/shoppingcart/${id}`, {
            method: "delete",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as number;
    }
    
    public async deleteUser(): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
     
        if (!token) {
            throw new Error("Authentication token missing");
        }
     
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/deleteProfile`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        });
     
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
    }
    
    public async getIdAndAmountFromCart(): Promise<
        { id: number; amount: number; price: number }[] | undefined
    > {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/items`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as { id: number; amount: number; price: number }[];
    }

    public async getSingleItem(id: OrderItem): Promise<{ id: number } | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/singleItem/${id.id}`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as { id: number };
    }

    public async shippingDetails(address: Address): Promise<Address | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            console.error("No token found");
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/shippingDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            body: JSON.stringify(address),
        });

        if (!response.ok) {
            console.error("Failed to fetch shipping details:", response);
            return undefined;
        }

        return (await response.json()) as Address;
    }
    public async updateShippingDetails(address: Address): Promise<Address | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            console.error("No token found");
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/updateShippingDetails`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            body: JSON.stringify(address),
        });

        if (!response.ok) {
            console.error("Failed to fetch shipping details:", response);
            return undefined;
        }

        return (await response.json()) as Address;
    }

    public async getProfileDetails(): Promise<profileDetails[] | undefined>{
        const token: string | undefined = this._tokenService.getToken();
 
        if (!token) {
            return undefined;
        }
 
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: token,},
        });
 
        if (!response.ok) {
            console.error (response);
            return undefined;
        }
        
        const data: profileDetails[] = await response.json();
        return data;
    }

    
}