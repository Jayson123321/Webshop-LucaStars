import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { Root } from "../components/Root";
import { Address, OrderItem } from "@shared/types";
import { map } from "lit/directives/map.js";

@customElement("webshop-shoppingcart")
export class ShoppingCart extends LitElement {
    private _userService: UserService = new UserService();
    private _userMessage: string = "";
    private rootInstance: Root = new Root();
    private currentStep: number = 1;
    public static styles = css`
        header {
            background-color: #fbfbfa;
            padding: 10px;
        }

        main {
            padding: 10px;
        }

        footer {
            background-color: #ecae20;
            padding: 10px;
            text-align: center;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        nav .logo img {
            width: auto;
            height: 100px;
            cursor: pointer;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form label {
            display: block;
            margin-bottom: 5px;
        }

        .field__input {
            border-radius: 5px;
            width: 100%;
        }
        .fields--2 {
            grid-template-columns: 1fr 1fr;
        }
        .fields--3 {
            grid-template-columns: 1fr 1fr 1fr;
        }
        .discountField {
            border: 2px solid #383c9c;
            width: 10%;
            height: 40px;
            text-align: center;
            font-size: 20px;
        }
        .cart-items {
            margin-top: 20px;
        }

        .product {
            margin-bottom: 10px;
            white-space: nowrap;
        }
        .product-price {
            font-weight: bold;
        }
        .totalAmount {
            font-weight: bold;
        }
        .itemOverallCheck {
            float: right;
        }

        .vatCalculation {
            font-weight: bold;
        }
        .product-title {
            font-weight: bold;
        }
        .success-message {
            display: none;
            color: green;
            background-color: #e0ffe0;
            border: 1px solid green;
            padding: 10px;
            margin: 10px 0;
        }
        .success-message.show {
            display: block;
        }
        .shippingUpdate {
            border-radius: 5px;
            border: 2px solid #373e98;
            padding: 2px;
            margin-top: 10px;
        }
        .changeButton {
            background-color: #373e98;
            padding: 3px 13px;
            border: none;
            border-radius: 13px;
            cursor: pointer;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            font-size: 11px;
        }
        .saveButton {
            background-color: #c5d85c;
            padding: 4px 20px;
            border: none;
            border-radius: 13px;
            cursor: pointer;
            font-size: 20px;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            font-size: small;
        }

        /* 
* Luca Stars huisstijl
* @author: Gillermo van Velzen
* @version: 0.1 
*/
        /* HTML elements */
        * {
            margin: 0;
            padding: 0;
        }
        .cart-items {
            margin-top: 20px;
        }

        .product {
            margin-bottom: 10px;
        }

        .product-title {
            font-weight: bold;
        }

        a {
            color: #373e98;
            font-style: normal;
            font-weight: 700;
            letter-spacing: -0.456px;
            text-decoration: none;
        }

        a.selected {
            text-decoration: underline;
            text-underline-offset: 3px;
        }
        body {
            font-family: Inter;
        }

        li {
            list-style: none;
        }

        input[type="text" i] {
            padding-block: 0px;
            padding-inline: 0px;
            color: #ecae20;
        }

        h1 {
            color: #ecae20;
            text-align: center;
            font-size: 26px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
            margin: 6px;
            letter-spacing: -1.408px;
        }

        h3 {
            display: inline;
        }

        a:hover {
            color: #ecae20;
        }

        /* Global elements */
        .wrapper {
            padding: 18px;
            min-height: 90vh;
        }

        /* Product section */

        .product-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin: 0 auto;
        }

        .product {
            max-width: 45%;
            text-align: center;
            margin-bottom: 7px;
        }

        .product img {
            background-image: url("image.png");
            width: 100%;
            max-width: 100%;
            height: auto;
        }

        .base-price {
            float: left;
            color: #1e1e1e;
            font-family: Inter;
            font-size: 1.3rem;
            font-style: normal;
            font-weight: 700;
            line-height: 37px;
            letter-spacing: -0.88px;
        }

        .product-filter {
            display: flex;
            color: #1e1e1e;
            font-family: Inter;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 150%;
            letter-spacing: -0.456px;
            gap: 19px;
        }

        /* buttons */

        button:hover {
            background-color: #ecae20;
        }

        .add-to-cart-button {
            float: right;
            background-color: #ff0000;
            width: 54%;
            height: 35px;
            border-radius: 30px;
        }

        .more-info-button {
            background-color: #373e98;
            width: 100%;
            height: 39px;
            border-radius: 30px;
            margin-bottom: 8px;
        }

        /* Navbar */
        .navbar {
            display: flex;
            justify-content: left;
            background-color: #ffffff;
            color: #373e98;
        }

        .navbar-right {
            float: right;
            height: auto;
            max-height: 100%;
        }

        .navigation {
            width: fit-content;
            flex-direction: row;
            align-items: baseline;
            margin: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .logo {
            max-width: 19vw;
            height: auto;
        }

        .navbar-links {
            display: flex;
            gap: 14px;
            margin: 0;
        }

        ul .navbar-links a {
            color: #fff;
            text-decoration: none;
        }

        .nav-shop {
            margin: 20px;
            flex-grow: 1;
        }

        .search-bar {
            width: 40vw;
            margin-bottom: 30px;
            align-items: center;
            height: 36px;
            padding: 0px;
            border-color: #373e98;
            border-width: 2px;
            border-radius: 4px;
            color: #000000;
            text-indent: 5px;
            font-size: larger;
        }

        .login-btn {
            background-color: #373e98;
            color: #fff;
            font-size: 17px;
            border: none;
            border-radius: 12px;
            float: right;
            height: 40px;
            letter-spacing: 0.5px;
            padding: 0 25px;
        }

        .cart-icon {
            float: right;
            width: 65px;
        }

        /* Login form */
        .login-form {
            display: flex;
            flex-direction: column;
            border: #373e98 4px solid;
            padding: 2% 6%;
            margin: 1% 11%;
        }
        .login-input {
            width: 100%;
            border: 2px #373e98 solid;
            height: 35px;
            border-radius: 4px;
            font-size: 20px;
            text-indent: 5px;
            margin-bottom: 2%;
        }
        .link {
            place-self: flex-end;
            color: #ecae20;
            letter-spacing: 0.1px;
            font-weight: 500;
        }
        .link:hover {
            color: #373e98;
        }
        .big-button {
            width: 100%;
            background-color: #373e98;
            padding: 16px;
            border-radius: 15px;
        }
        .text-divider {
            color: #373e98;
            text-align: center;
            display: inline-block;
            font-size: 26px;
            font-style: normal;
            font-weight: 700;
            line-height: 150%;
        }

        /* Footer */

        footer {
            color: #ecae20;
            bottom: 0;
            background-color: #373e98;
            min-height: fit-content;
            height: auto;
        }

        .footer-content {
            color: #ecae20;
            display: flex;
            justify-content: left;
            margin-left: 1px;
            flex-direction: row;
            min-height: fit-content;
        }

        .footer-column {
            margin-top: 14px;
            padding: 0px 10px;
            border-right: 2px solid #ffffff;
            border-radius: 1px;
            min-width: 0;
            flex-grow: 1;
        }

        .footer-column ul {
            list-style-type: none;
            padding: 0;
        }

        .footer-column ul li {
            margin-bottom: 5px;
        }

        .footer-column h3 {
            text-transform: uppercase;
            color: #ecae20;
            font-family: Inter;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 150%;
            /* 36px */
        }

        .footer-column:last-child {
            border: none;
        }

        .footer-column:first-child {
            padding-left: 0;
        }

        .footer-link {
            color: #ecae20;
            font-family: Inter;
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
            /* 36px */
            text-transform: capitalize;
        }

        /* Responsive styles*/

        /* Styles for screens between 576px and 767.98px (e.g., tablets in portrait mode) */
        @media (min-width: 576px) {
            .footer-column {
                border-width: 2px;
                padding: 0px 10px;
            }

            .logo {
                max-width: 15vw;
            }
            .field {
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 0.5rem;
            }

            .field__label {
                font-size: 15px;
                font-weight: 300;
            }

            .field__input {
                font-size: 1rem;
                width: 100%;
                height: 30px;
            }

            .fields {
                display: grid;
                grid-gap: 1rem;
            }
        }

        /* Styles for screens from 768px(e.g., tablets in landscape mode) */
        @media (min-width: 768px) {
            footer,
            .wrapper {
                padding: 39px;
            }

            .logo {
                max-width: 12vw;
            }

            .add-to-cart-button {
                width: 60%;
            }

            .product {
                max-width: 48%;
            }

            .product-filter {
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: 150%;
                /* 36px */
                letter-spacing: 0.5px;
                margin: 5px 0;
            }

            .footer-column h3 {
                font-size: 20px;
            }

            .footer-column {
                border-width: 3px;
                padding: 0px 30px;
            }

            .footer-link {
                font-size: 20px;
            }
            h1 {
                font-size: 38px;
                margin: 20px;
            }
            .login-btn {
                padding: 0 35px;
            }
        }

        /* Styles for screens from 992px and up */
        @media (min-width: 992px) {
            .product {
                max-width: 31%;
            }

            .footer-column h3 {
                font-size: 24px;
            }
            .login-btn {
                padding: 0 40px;
            }
        }

        /* Styles for screens larger than or equal to 1200px (e.g., desktops) */
        @media (min-width: 1200px) {
            .product {
                max-width: 24%;
            }
            .cart-items {
                margin-top: 20px;
            }

            .product {
                margin-bottom: 10px;
            }

            .product-title {
                font-weight: bold;
            }

            .remove-button {
                margin-left: 10px;
                padding: 6px 12px;
                background-color: #ff6b6b;
                color: #ffffff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition:
                    background-color 0.3s ease,
                    transform 0.2s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .remove-button:hover {
                background-color: #ff4949;
                transform: translateY(-2px);
            }

            .remove-button:active {
                background-color: #ff1e1e;
                transform: translateY(0);
            }

            button.more-info-button {
                height: 50px;
                border-radius: 30px;
                margin-bottom: 9px;
            }

            .base-price {
                font-size: 24px;
            }

            button.add-to-cart-button {
                width: 60%;
                height: 40px;
            }
            .form-register {
                margin: auto;
                width: 30%;
                border: 3px solid #6d71b4;
                padding: 30px;
                border-radius: 5px;
                margin-top: 1%;
            }
            .createAccountText {
                color: #edb32e;
                margin: auto;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: sans-serif;
                font-size: 40px;
            }
            .register-btn {
                border-radius: 16px;
                margin-top: 30%;
                padding: 10px;
                background-color: #373e98;
                width: 100%;
            }
            .login-btn {
                background-color: #373e98;
                width: 13%;
                padding: 1px;
            }
            .form-login {
                margin: auto;
                width: 30%;
                border: 3px solid #6d71b4;
                padding: 30px;
                border-radius: 5px;
                margin-top: 1%;
            }
            .login-button {
                border-radius: 16px;
                margin-top: 30%;
                padding: 10px;
                background-color: #373e98;
                width: 100%;
            }
        }
        .cart-items {
            margin-top: 20px;
        }

        .product {
            margin-bottom: 10px;
        }

        .product-title {
            font-weight: bold;
        }

        .remove-button {
            margin-left: 10px;
            color: red;
            cursor: pointer;
        }

        .step {
            border: 2px solid #373e98;
            padding: 2%;
            width: 15%;
        }
        .steps {
            display: flex;
            color: #373e98;
            font-weight: 700;
            width: 100%;
        }

        .step.active {
            background-color: #373e98;
            color: white;
            align-items: center;
        }

        .orderDetails,
        .orderDetails2,
        .orderDetails3,
        .orderDetails4 {
            border: 1px solid #ccc;
            padding: 20px;
        }

        .OrderOverview {
            width: 40%;
            padding: 5%;
            margin: 0 auto;
        }

        .nextStep {
            float: right;
            background-color: red;
            color: white;
            border-radius: 12px;
            padding: 10px;
            width: 20%;
            border: none;
            margin-top: 2%;
            cursor: pointer;
        }
        .backstep {
            float: left;
            background-color: white;
            color: black;
            border-radius: 12px;
            padding: 10px;
            width: 20%;
            border: solid 1px black;
            cursor: pointer;
        }
        .placeOrder {  
            float: right;
            background-color: rgba(24,172,116,255);
            color: white;
            border-radius: 12px;
            padding: 10px;
            width: 20%;
            border: none;
            margin-top: 2%;
            cursor: pointer;
        }
        .field {
            width: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--color-lighter-gray);
            padding: 0.5rem;
            border-radius: 0.25rem;
        }

        .field__label {
            color: var(--color-gray);
            font-size: 0.6rem;
            font-weight: 300;
            text-transform: uppercase;
            margin-bottom: 0.25rem;
        }

        .field__input {
            padding: 0;
            margin: 0;
            outline: 0;
            font-weight: bold;
            font-size: 1rem;
            width: 100%;
            -webkit-appearance: none;
            appearance: none;
            background-color: transparent;
        }

        .fields {
            display: grid;
            grid-gap: 1rem;
        }
        .fields--2 {
            grid-template-columns: 1fr 1fr;
        }
        .fields--3 {
            grid-template-columns: 1fr 1fr 1fr;
        }
        .fields--4 {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    `;
    @state()
    public _cartItemsCount: number = 0;

    @state()
    private _itemsInCart: OrderItem[] = [];
    @state()
    private _shippingDetails: Address[] = [];

    public static addToCart: any;

    public selectedPaymentMethod: string | undefined;

    @state()
    private showStreet: boolean = false;

    @state()
    private showCountry: boolean = false;

    @state()
    private showZip: boolean = false;

    @state()
    private showCity: boolean = false;

    @state()
    private showSuccessMessage: boolean = false;

    public combinedClickHandler(): void {
        this.nextStepClicked();
        this.handleTestButtonClick();
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }
    public render(): TemplateResult {
        const footerTemplate: TemplateResult = this.rootInstance.renderFooter();
        return html`
             <header>
                <div class="navbar">
                    <nav>
                        <div
                            class="logo"
                        >
                            <img src="/assets/img/logo.png" alt="Logo" />
                        </div>
                        <ul class="navbar-links">
                            <div
                                class="navbar-option"

                            >
                                <li><a href="index.html">Games</a></li>
                            </div>
                            <div
                                class="navbar-option"

                            >
                                <li><a href="index.html">Merchandise</a></li>
                            </div>
                        </ul>
                        <form class="nav-search">
                            <input
                                type="text"
                                placeholder="Search"
                                class="search-bar"
                            />
                        </form>
                    </nav>
                </div>
            </header>
            <div class="shopping-cart">
                <h2>Shopping Cart</h2>
                <div>${this._userMessage}</div>
         ${this.successMessage()}
                <div class="OrderOverview">
                    <div class="steps">
                        <div class="${this.currentStep === 1 ? "step active" : "step"}">Step 1</div>
                        <div class="${this.currentStep === 2 ? "step active" : "step"}">Step 2</div>
                        <div class="${this.currentStep === 3 ? "step active" : "step"}">Step 3</div>
                        <div class="${this.currentStep === 4 ? "step active" : "step"}">Step 4</div>
                    </div>
                    ${this.currentStep === 1
                        ? html`
                              <div class="orderDetails">
                                  <h2>Order overview</h2>
                                  <ul>
                                  <li>${this.renderCartItems()}</li>
                                      <li>Merch:</li>
                                      <li>${this.totalAmount()}</li>
                                      <li>${this.vatCalculation()}</li>
                                  </ul>
                                  <input
                                      type="submit"
                                      class="nextStep"
                                      value="Next step"
                                      @click=${this.nextStepClicked}
                                  />
                              </div>
                          `
                        : ""}
                    ${this.currentStep === 2
                        ? html`
                              <div class="orderDetails orderPayment">
                                  <h2>Select payment method</h2>
                                  <select id="payment_method" class="payment_method">
                                      <option value="Creditcard">Credit Card</option>
                                      <option value="Paypal">PayPal</option>
                                      <option value="Ideal">Ideal</option>
                                  </select>
                                  <label class="field">
                                      <span class="field__label">street</span>
                                      <input class="field__input" type="text" id="street" />
                                  </label>
                                  <label class="field">
                                      <span class="field__label">Country</span>
                                      <select class="field__input" id="country">
                                          <option value=""></option>
                                          <option>Netherlands</option>
                                          <option>Belgium</option>
                                          <option>Germany</option>
                                          <option>United States</option>
                                      </select>
                                  </label>
                                  <div class="fields fields--3">
                                      <label class="field">
                                          <span class="field__label">Zip code</span>
                                          <input class="field__input" type="text" id="zipcode" />
                                      </label>
                                      <label class="field">
                                          <span class="field__label">City</span>
                                          <input class="field__input" type="text" id="city" />
                                      </label>
                                  </div>
                                  <input
                                      type="submit"
                                      class="nextStep"
                                      value="Next step"
                                      @click=${this.combinedClickHandler}
                                  />
                              </div>
                              <input
                                      type="submit"
                                      class="backstep"
                                      value="Back"
                                      @click=${this.backStepClicked}
                                  />
                              </div>
                          `
                        : ""}
                    ${this.currentStep === 3
                        ? html` <div class="orderDetails overallCheck">
                              <h2>Overall check</h2>
                              <div class="itemOverallCheck">
                                  <h3>Items</h3>
                                  <ul>
                                      <li>${this.OverAllCheck()}</li><br><br>
                                      <li>${this.totalAmount()}</li>
                                      <li>${this.getPaymentMethod()}</li>
                                  </ul>
                              </div>
                              <div class="shippingOverallCheck"> ${this.showShippingDetails()}</div>
                              <input
                                  type="submit"
                                  class="placeOrder"
                                  value="Place order"
                                  @click=${this.nextStepClicked}

                              />
                          </div>
                          <input
                                      type="submit"
                                      class="backstep"
                                      value="Back"
                                      @click=${this.backStepClicked}
                                  />
                              </div>`
                        : ""}
                    ${this.currentStep === 4 
                        ? html` <div class="orderDetails finalStep">
                        <div class="orderDetails finalStep">
                            <h2>Confirmation</h2>
                            <p>Thank you for your order!</p>
                            <p>An order confirmation has been sent to your email address.</p>
                            <p>Please check your email for further details.</p>
                            <a href ="index.html"><input type="submit" class="nextStep" value="Finish"/></a>
                        </div>
                        </div>
                        ` : ""}

                </div>

                ${footerTemplate}
            </div>
        `;
    }

    private handleTestButtonClick(): void {
        const countryInput: HTMLSelectElement | null = this.shadowRoot?.getElementById(
            "country",
        ) as HTMLSelectElement;
        const zipcodeInput: HTMLInputElement | null = this.shadowRoot?.getElementById(
            "zipcode",
        ) as HTMLInputElement;
        const cityInput: HTMLInputElement | null = this.shadowRoot?.getElementById(
            "city",
        ) as HTMLInputElement;
        const streetInput: HTMLInputElement | null = this.shadowRoot?.getElementById(
            "street",
        ) as HTMLInputElement;
        const payment_method: HTMLSelectElement | null = this.shadowRoot?.getElementById(
            "payment_method",
        ) as HTMLSelectElement;

        if (countryInput && zipcodeInput && cityInput && streetInput && payment_method) {
            const address: Address = {
                id: 1,
                street: streetInput.value,
                city: cityInput.value,
                zip: zipcodeInput.value,
                country: countryInput.value,
                payment_method: payment_method.value,
            };
            console.log(address);
            void this.ShippingDetails(address);
        } else {
            console.error("One or more input elements are missing");
        }
    }

    private async ShippingDetails(address: Address): Promise<void> {
        try {
            const shippingDetails: Address | undefined = await this._userService.shippingDetails(address);
            console.log("Shipping Details:", shippingDetails);
        } catch (error) {
            console.error("Error fetching shipping details:", error);
        }
    }

    private async removeItemFromCart(orderItem: OrderItem): Promise<void> {
        const result: number | undefined = await this._userService.removeOrderItemFromCart(orderItem.id);
        if (!result) {
            return;
        }
    }

    private renderCartItems(): TemplateResult {
        return html`
                    ${this.getCartItems()}
            <div class="cart-items">
                ${this._itemsInCart.map(
                    (orderItem) => html`
                        <div class="product">
                            <span class="product-title">Game ${orderItem.title} ${orderItem.id}</span>
                            <span class="product-name">${orderItem.name}:</span>
                            <span class="product-price">€ ${orderItem.price}</span>
                            <button
                                class="remove-button"
                                @click=${(): Promise<void> => this.removeItemFromCart(orderItem)}
                            >
                                Remove item
                            </button>
                        </div>
                    `,
                )}
            </div>
            
        `;
    }
    private totalAmount(): TemplateResult {
        let totalPrice: number = 0;
        this._itemsInCart.forEach((orderItem) => {
            totalPrice += orderItem.price;
        });
        return html` Total amount incl. VAT:<span class="totalAmount">€ ${totalPrice}</span> `;
    }

    private vatCalculation(): TemplateResult {
        let totalVat: number = 0;
        this._itemsInCart.forEach((orderItem) => {
            totalVat += orderItem.price * 0.21;
        });
        totalVat = Math.round(totalVat * 100) / 100;
        return html`
            <div class="product">VAT 21%:<span class="vatCalculation">€ ${totalVat.toFixed(2)}</span></div>
        `;
    }

    private OverAllCheck(): TemplateResult {
        return html`
            ${this._itemsInCart.map(
                (orderItem) => html` <div class="product">Game ${orderItem.title}: ${orderItem.name}</div> `,
            )}
        `;
    }
    private getPaymentMethod(): TemplateResult {
        return html`
            ${this._shippingDetails.map(
                (shipping) => html`
                    <div class="shippingDetails">Payment method: ${shipping.payment_method}</div>
                `,
            )}
        `;
    }
    private async getCartItems(): Promise<void> {
        const cartItems: OrderItem[] | undefined = await this._userService.getCartItems();
        if (!cartItems) {
            return;
        }
        this._itemsInCart = cartItems;
    }

    private async getShippingDetails(): Promise<void> {
        const shippingDetails: Address[] | undefined = await this._userService.getShippingDetails();
        if (!shippingDetails) {
            return;
        }
        this._shippingDetails = shippingDetails;
    }
    private showShippingDetails(): TemplateResult {
        void this.getShippingDetails();
        return html`
            ${map(
                this._shippingDetails,
                (shipping) => html`
                    <div class="shippingDetails">
                        <h3>Shipping details</h3>
                        <ul>
                            <li>
                                Street:
                                ${this.showStreet
                                    ? html` <input
                                          type="text"
                                          class="shippingUpdate"
                                          id="updatedStreet"
                                          .value=${shipping.street}
                                      />`
                                    : html`${shipping.street}`}
                            </li>
                            <button
                                class="changeButton"
                                @click=${(): boolean => (this.showStreet = !this.showStreet)}
                            >
                                Change
                            </button>

                            <li>
                                Country:
                                ${this.showCountry
                                    ? html`
                                          <select
                                              class="shippingUpdate"
                                              id="updatedCountry"
                                              .value=${shipping.country}
                                          >
                                              <option value=""></option>
                                              <option>Netherlands</option>
                                              <option>Belgium</option>
                                              <option>Germany</option>
                                              <option>United States</option>
                                          </select>
                                      `
                                    : html`${shipping.country}`}
                            </li>
                            <button
                                class="changeButton"
                                @click=${(): boolean => (this.showCountry = !this.showCountry)}
                            >
                                Change
                            </button>

                            <li>
                                Zip code:
                                ${this.showZip
                                    ? html` <input
                                          type="text"
                                          class="shippingUpdate"
                                          id="updatedZip"
                                          .value=${shipping.zip}
                                      />`
                                    : html`${shipping.zip}`}
                            </li>
                            <button
                                class="changeButton"
                                @click=${(): boolean => (this.showZip = !this.showZip)}
                            >
                                Change
                            </button>

                            <li>
                                City:
                                ${this.showCity
                                    ? html` <input
                                          type="text"
                                          class="shippingUpdate"
                                          id="updatedCity"
                                          .value=${shipping.city}
                                      />`
                                    : html`${shipping.city}`}
                            </li>
                            <button
                                class="changeButton"
                                @click=${(): boolean => (this.showCity = !this.showCity)}
                            >
                                Change
                            </button>

                            <button class="saveButton" @click=${this.updateShippingDetails}>Save</button>
                        </ul>
                    </div>
                `,
            )}
        `;
    }
    private async updateShippingDetails(): Promise<void> {
        const countryInput: HTMLSelectElement | null = this.shadowRoot?.getElementById(
            "updatedCountry",
        ) as HTMLSelectElement;
        const zipcodeInput: HTMLInputElement | null = this.shadowRoot?.getElementById(
            "updatedZip",
        ) as HTMLInputElement;
        const cityInput: HTMLInputElement | null = this.shadowRoot?.getElementById(
            "updatedCity",
        ) as HTMLInputElement;
        const streetInput: HTMLInputElement | null = this.shadowRoot?.getElementById(
            "updatedStreet",
        ) as HTMLInputElement;

        for (const shipping of this._shippingDetails) {
            const updatedStreet: string = streetInput?.value || shipping.street;
            const updatedCity: string = cityInput?.value || shipping.city;
            const updatedZip: string = zipcodeInput?.value || shipping.zip;
            const updatedCountry: string = countryInput?.value || shipping.country;
            const updatedPaymentMethod: string = shipping.payment_method;
            const address: Address = {
                id: shipping.id,
                street: updatedStreet,
                city: updatedCity,
                zip: updatedZip,
                country: updatedCountry,
                payment_method: updatedPaymentMethod,
            };

            console.log("Address to update:", address);

            try {
                const updatedAddress: Address | undefined =
                    await this._userService.updateShippingDetails(address);

                if (updatedAddress) {
                    console.log("Shipping details updated successfully:", updatedAddress);
                    this.showSuccessMessage = true;
                    this.requestUpdate();
                    setTimeout(() => {
                        this.showSuccessMessage = false;
                        this.requestUpdate();
                    }, 5000);
                } else {
                    console.error("Failed to update shipping details");
                }
            } catch (error) {
                console.error("Error updating shipping details:", error);
            }
        }
    }

    private successMessage(): TemplateResult {
        return html`
            <div id="successMessage" class="success-message ${this.showSuccessMessage ? "show" : ""}">
                Shipping details succesfully updated.
            </div>
        `;
    }
    private nextStepClicked(): void {
        if (this.currentStep < 4) {
            this.currentStep += 1;
            this.requestUpdate();
        }
    }
    private backStepClicked(): void {
        if (this.currentStep > 1) {
            this.currentStep -= 1;
            this.requestUpdate();
        }
    }
}
