import { html, css, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Root } from "../components/Root";

@customElement("webshop-login")
export class login extends LitElement {
    private rootInstance: Root = new Root();

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
        .btn,
        button {
            padding: 4px 20px;
            color: white;
            border: none;
            border-radius: 13px;
            cursor: pointer;
            font-size: 20px;
        }

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
    `;
    public render(): TemplateResult {
        const loginTemplate: TemplateResult = this.rootInstance.renderLogin();

        return html` ${loginTemplate} `;
    }
}
