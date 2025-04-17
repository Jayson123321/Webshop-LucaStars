import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { ProductService } from "../services/ProductService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { map } from "lit/directives/map.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { UserRegisterFormModel } from "@shared/formModels";
// import { env } from "process";

/** Enumeration to keep track of all the different pages */
export enum RouterPage {
    ForgotPassword = "forgotPassword",
    Home = "orderItems",
    ResetPassword = "resetPassword",
    Login = "login",
    Admin = "Admin",
    Register = "register",
    Games = "games",
    Merchandise = "merchandise",
    GameDetails = "game-details",
    MerchandiseDetails = "merchandise-details",
    Profile = "profile",
    EditProfilePage = "EditProfilePage",
}

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class Root extends LitElement {
    @property({ type: String }) public _gender = "";

    public constructor() {
        super();
        this.onChangeGender = this.onChangeGender.bind(this);
        this._filteredItems = [...this._orderItems];
    }
    /**
     * Styles for the webshop-root component
     */
    public static styles = css`
        header {
            background-color: #fbfbfa;
            padding: 10px;
        }

        main {
            padding: 10px;
        }

        body {
            overflow: hidden;
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

        a.button {
            color: white;
            padding-top: -100px;
        }

        /* a.selected {
            text-decoration: underline;
            text-underline-offset: 3px;
        } */

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
            font-size: 40px;
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

        .product-details {
            display: block;
            text-align: center;
            min-height: fit-content;
        }

        .product-details h2 {
            color: #2e2d2d;
            margin-bottom: 30px;
        }

        .product-details img {
            width: 60%;
            max-width: 550px;
            border: 8px ridge rgb(55, 62, 152);
            border-radius: 6px;
            height: auto;
        }
        .product-details img.merch {
            max-width: 475px;
        }

        .product-details img.gallery {
            border: #f7f7f7 16px solid;
            margin: 40px;
            outline: #eae9e9 2px solid;
            max-width: 400px;
            box-shadow: 0px 0px 12px #d5d5d5;
        }

        .banner {
            background-color: #f7f7f7;
            margin-bottom: 60px;
            border-radius: 2px;
            outline: #eae9e9 solid 2px;
            box-shadow: 0px 0px 10px #d5d5d5;
        }

        .title-details {
            display: block;
            margin: 0 auto;
            width: 54vh;
            font-size: 28px;
            margin-bottom: 100px;
        }

        .buttons-details {
            position: relative;
            display: grid;
            margin-left: auto;
            margin-top: -30px;
            margin-bottom: 40px;
            width: 54vh;
        }

        .add-to-cart-details {
            background-color: #ff0000;
            width: 45%;
            padding: 15px;
            border-radius: 30px;
        }

        .base-price-details {
            color: #1e1e1e;
            font-size: 1.6rem;
            font-style: normal;
            font-weight: 700;
            line-height: 37px;
            letter-spacing: -0.88px;
        }

        .details {
            display: flex;
            flex-basis: 37%;
            flex-flow: row wrap;
            padding: 30px;
            text-align: justify;
            text-align-last: center;
            margin-left: auto;
            margin-right: auto;
            margin-top: 40px;
            margin-bottom: 40px;
            border-top: #e3e3e3 solid 2px;
            border-bottom: #e3e3e3 solid 2px;
            border-radius: 3px;
        }

        .extra.details {
            display: grid;
            outline: none;
            background-color: #f9f8f8;
        }

        .detail-text {
            border-radius: 2px;
            margin-bottom: 12px;
            border-bottom: #e3e3e3 solid 2px;
        }

        .product {
            max-width: 45%;
            text-align: center;
            margin-bottom: 7px;
            padding-top: 20px;
            padding-right: 20px;
        }

        .product img {
            width: 325px;
            height: 250px;
            object-fit: cover;
            border: 6px ridge #373e98;
            border-radius: 6px;
            margin-bottom: 10px;
            transition: transform 0.1s;
            cursor: pointer;
            box-shadow: 0px 0px 12px black;
        }

        .product img.merch-game {
            width: 325px;
            height: 310px;
            object-fit: cover;
            border: 6px ridge #373e98;
            border-radius: 6px;
            margin-bottom: 10px;
            transition: transform 0.1s;
            cursor: pointer;
            box-shadow: 0px 0px 12px black;
        }

        .product img:hover {
            transform: scale(1.08);
            box-shadow: 0px 0px 10px darkblue;
        }

        .base-price {
            float: left;
            color: #1e1e1e;
            font-size: 1.3rem;
            font-style: normal;
            font-weight: 700;
            line-height: 37px;
            letter-spacing: -0.88px;
        }

        .product-filter {
            display: flex;
            color: #1e1e1e;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 150%;
            letter-spacing: -0.456px;
            gap: 19px;
        }

        /* Homepage section */
        .promo-banner {
            background-color: #f0f0f0;
            text-align: center;
            padding: 50px 20px;
        }

        .promo-banner h2 {
            font-size: 24px;
            color: #333;
        }

        .more-info-btn {
            background-color: #ff0000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }

        .promo-banner {
            background-color: #f0f0f0;
            text-align: center;
            padding: 50px 20px;
        }

        .promo-banner h2 {
            font-size: 24px;
            color: #333;
        }

        .more-info-btn {
            background-color: #ff0000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }

        .sliding-banner {
            display: flex;
            overflow: hidden;
            margin-top: 20px;
        }

        .sliding-banner .slide {
            min-width: 100%;
            transition: 0.5s;
            padding: 20px;
            background-color: #ccc;
            border-radius: 8px;
            margin: 0 10px;
            font-size: 18px;
            color: #333;
        }

        .merchandise-section {
            text-align: center;
            padding: 50px 20px;
        }

        .merchandise-section h2 {
            font-size: 24px;
            color: #ecae20;
        }

        .merch-carousel {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
        }

        .carousel-btn {
            background-color: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
        }

        .merch-items {
            display: flex;
            gap: 20px;
        }

        .merch-item {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            width: 200px;
            text-align: center;
        }

        .shop-now-btn {
            background-color: #ff0000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }

        .order-items-section {
            padding: 20px;
        }

        .order-items-section h1 {
            font-size: 26px;
            color: #373e98;
            text-align: center;
            margin-bottom: 20px;
        }

        .order-items {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }

        .order-items p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .order-items img {
            width: 100%;
            height: auto;
            margin-bottom: 10px;
        }

        .order-item {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            width: 200px;
            text-align: center;
        }

        .order-item img {
            width: 100%;
            height: auto;
            margin-bottom: 10px;
        }

        footer {
            background-color: #373e98;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .footer-content {
            display: flex;
            justify-content: space-around;
            padding: 20px 0;
        }

        .footer-column h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .footer-column ul {
            list-style: none;
            padding: 0;
        }

        .footer-column ul li {
            margin-bottom: 5px;
        }

        .footer-column ul li a {
            color: #ecae20;
            text-decoration: none;
        }

        .social-media {
            margin-top: 20px;
        }

        .social-media h2 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .social-media .icons {
            display: flex;
            gap: 20px;
        }

        .social-media .icons a img {
            width: 30px;
            height: 30px;
        }

        /* General styles */
        body,
        html {
            margin: 0;
            padding: 0;
            font-family: "Inter", sans-serif;
        }

        header {
            background-color: #fbfbfa;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }

        .navbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .navbar-links {
            display: flex;
            gap: 20px;
        }

        .navbar-links li {
            list-style: none;
        }

        .navbar-links a {
            text-decoration: none;
            color: #373e98;
            font-weight: bold;
        }

        .search-bar {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
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

        .login-btn {
            background-color: #373e98;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .cart-icon img {
            width: 30px;
            height: 30px;
        }

        main {
            padding: 20px;
        }

        .promo-banner {
            background-color: #f0f0f0;
            text-align: center;
            padding: 50px 20px;
        }

        .promo-banner h2 {
            font-size: 24px;
            color: #333;
        }

        .more-info-btn {
            background-color: #ff0000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }

        .sliding-banner {
            display: flex;
            overflow: hidden;
            margin-top: 20px;
        }

        .sliding-banner .slide {
            min-width: 100%;
            transition: 0.5s;
            padding: 20px;
            background-color: #ccc;
            border-radius: 8px;
            margin: 0 10px;
            font-size: 18px;
            color: #333;
        }

        .merchandise-section {
            text-align: center;
            padding: 50px 20px;
        }

        .merchandise-section h2 {
            font-size: 24px;
            color: #ecae20;
        }

        .merch-carousel {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
        }

        .carousel-btn {
            background-color: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
        }

        .merch-items {
            display: flex;
            gap: 20px;
        }

        .merch-item {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            width: 200px;
            text-align: center;
        }

        .shop-now-btn {
            background-color: #ff0000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }

        footer {
            background-color: #373e98;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .footer-content {
            display: flex;
            justify-content: space-around;
            padding: 20px 0;
        }

        .footer-column h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .footer-column ul {
            list-style: none;
            padding: 0;
        }

        .footer-column ul li {
            margin-bottom: 5px;
        }

        .footer-column ul li a {
            color: #ecae20;
            text-decoration: none;
        }

        .social-media {
            margin-top: 20px;
        }

        .social-media h2 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .social-media .icons {
            display: flex;
            gap: 20px;
        }

        .social-media .icons a img {
            width: 30px;
            height: 30px;
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
            background-color: #373e98;
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
            margin-top: 10px;
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

        .navbar-games {
            text-decoration: underline;
            text-decoration-color: blue;
            text-underline-offset: 3px;
        }

        .navbar-merch {
            text-decoration: underline;
            text-decoration-color: blue;
            text-underline-offset: 3px;
        }

        .navbar-news {
            text-decoration: underline;
            text-decoration-color: blue;
            text-underline-offset: 3px;
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
            border-radius: 16px;
            width: 100%;
            color: white;
            padding: 10px;
        }
        .text-divider {
            color: #373e98;
            text-align: center;
            display: inline-block;
            font-size: 26px;
            font-style: normal;
            font-weight: 700;
            line-height: 150%;
            padding-left: 220px;
        }

        .gametext {
            font-size: 20px;
            font-style: normal;
            font-weight: bold;
            line-height: 150%;
            /* 36px */
            letter-spacing: 0.5px;
            margin: 5px 0;
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

            .filter-option {
                width: 15rem;
                background-color: #f8ca61;
                border: #f8ca61 4px solid;
                border-radius: 4px;
                padding: 5px;
            }

            .filter-option {
                text-decoration: underline;
                text-decoration-color: blue;
                text-underline-offset: 3px;
            }

            .clear-filter {
                cursor: pointer;
            }

            .choose-option {
                font-weight: 700;
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
                margin-bottom: 120px;
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

    @state()
    private _currentPage: RouterPage = RouterPage.Home;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _searchQuery: string = "";

    @state()
    private _filteredItems: any[] = [];

    @state()
    private _forgotPasswordEmail: string = "";

    @state()
    private _navigationStack: RouterPage[] = [];

    @state()
    private _orderItems: OrderItem[] = [];

    @state()
    public _cartItemsCount: number = 0;

    @state()
    public _totalPrice: number = 0;

    @state()
    public _product: OrderItem = {
        id: 0,
        title: "",
        name: "",
        price: 0,
    };

    @state()
    private _genreIsClicked: boolean = false;

    @state()
    private _ratingIsClicked: boolean = false;

    @state()
    private _nameIsClicked: boolean = false;

    @state()
    private _priceIsClicked: boolean = false;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _productService: ProductService = new ProductService();
    private _tokenService: TokenService = new TokenService();

    private _email: string = "";
    private _password: string = "";
    private _name: string = "";
    private _street: string = "";
    private _houseNumber: string = "";
    private _country: string = "";

    private _repeatPassword: string = "";
    private _dateOfBirth: string = "";

    private merchArray: Array<{ id: number; image: string }> = [
        { id: 0, image: "/assets/img/merch/shirt-id-1.png" },
        { id: 1, image: "/assets/img/merch/shirt-id-2.png" },
        { id: 2, image: "/assets/img/merch/shirt-id-3.png" },
        { id: 3, image: "/assets/img/merch/beanie-id-1.png" },
        { id: 4, image: "/assets/img/merch/beanie-id-2.png" },
        { id: 5, image: "/assets/img/merch/beanie-id-3.png" },
        { id: 6, image: "/assets/img/merch/mug-id-1.png" },
        { id: 7, image: "/assets/img/merch/mug-id-2.png" },
        { id: 8, image: "/assets/img/merch/mug-id-3.png" },
        { id: 9, image: "/assets/img/merch/lanyard-id-1.png" },
        { id: 10, image: "/assets/img/merch/lanyard-id-2.png" },
        { id: 11, image: "/assets/img/merch/lanyard-id-3.png" },
        { id: 12, image: "/assets/img/merch/shirt-id-4.png" },
        { id: 13, image: "/assets/img/merch/shirt-id-5.png" },
        { id: 14, image: "/assets/img/merch/shirt-id-6.png" },
        { id: 15, image: "/assets/img/merch/beanie-id-4.png" },
        { id: 16, image: "/assets/img/merch/beanie-id-5.png" },
        { id: 17, image: "/assets/img/merch/beanie-id-6.png" },
        { id: 18, image: "/assets/img/merch/mug-id-4.png" },
        { id: 19, image: "/assets/img/merch/mug-id-5.png" },
        { id: 20, image: "/assets/img/merch/mug-id-6.png" },
        { id: 21, image: "/assets/img/merch/lanyard-id-4.png" },
        { id: 22, image: "/assets/img/merch/lanyard-id-5.png" },
        { id: 23, image: "/assets/img/merch/lanyard-id-6.png" },
        { id: 24, image: "/assets/img/merch/shirt-id-7.png" },
        { id: 25, image: "/assets/img/merch/shirt-id-8.png" },
        { id: 26, image: "/assets/img/merch/shirt-id-9.png" },
        { id: 27, image: "/assets/img/merch/beanie-id-7.png" },
        { id: 28, image: "/assets/img/merch/beanie-id-8.png" },
        { id: 29, image: "/assets/img/merch/beanie-id-9.png" },
        { id: 30, image: "/assets/img/merch/mug-id-7.png" },
        { id: 31, image: "/assets/img/merch/mug-id-8.png" },
        { id: 32, image: "/assets/img/merch/mug-id-9.png" },
        { id: 33, image: "/assets/img/merch/lanyard-id-7.png" },
        { id: 34, image: "/assets/img/merch/lanyard-id-8.png" },
        { id: 35, image: "/assets/img/merch/lanyard-id-9.png" },
        { id: 36, image: "/assets/img/merch/shirt-id-7.png" },
        { id: 37, image: "/assets/img/merch/shirt-id-8.png" },
        { id: 38, image: "/assets/img/merch/shirt-id-9.png" },
        { id: 39, image: "/assets/img/merch/beanie-id-7.png" },
        { id: 40, image: "/assets/img/merch/beanie-id-8.png" },
        { id: 41, image: "/assets/img/merch/beanie-id-9.png" },
        { id: 42, image: "/assets/img/merch/mug-id-7.png" },
        { id: 43, image: "/assets/img/merch/mug-id-8.png" },
        { id: 44, image: "/assets/img/merch/mug-id-9.png" },
        { id: 45, image: "/assets/img/merch/lanyard-id-7.png" },
        { id: 46, image: "/assets/img/merch/lanyard-id-8.png" },
        { id: 47, image: "/assets/img/merch/lanyard-id-9.png" },
    ];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getOrderItems();
        await this.getWelcome();
        // Initialize filtered items with all items
        this._filteredItems = [...this._filteredItems];
    }

    /**
     * Check if the current token is valid and update the cart item total
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            this._cartItemsCount = result.cartItems?.length || 0;
        }
    }

    /**
     * Get all available order items
     */
    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();

        if (!result) {
            return;
        }

        console.log(result);
        this._orderItems = result;
        // Initialize filtered items with all items
        this._filteredItems = [...this._orderItems];
    }

    private async getGames(): Promise<void> {
        const result: OrderItem[] | undefined = await this._productService.getAllGames(this._product);

        if (!result) {
            return;
        }

        this._orderItems = result;

        console.log(result);
        // Initialize filtered items with all items
        this._filteredItems = [...this._orderItems];
    }

    private async getMerchandise(): Promise<void> {
        const result: OrderItem[] | undefined = await this._productService.getAllMerchandise(this._product);

        if (!result) {
            return;
        }

        this._orderItems = result;

        console.log(result);
        // Initialize filtered items with all items
        this._filteredItems = [...this._orderItems];
    }

    private navigateToPage(page: RouterPage): void {
        if (this._currentPage !== page) {
            this._navigationStack.push(this._currentPage);
            this._currentPage = page;
        }
    }

    private goBack(): void {
        const previousPage: RouterPage | undefined = this._navigationStack.pop();
        if (previousPage) {
            this._currentPage = previousPage;
        }
    }

    /**
     * Handler for the login form
     */
    private async submitLoginForm(): Promise<void> {
        const result: boolean = await this._userService.login({
            email: this._email,
            password: this._password,
        });

        if (result) {
            alert("Succesfully logged in!");
            await this.getWelcome();
            this.navigateToPage(RouterPage.Home);
        } else {
            alert("Failed to login!");
        }
    }

    /**
     * Handler for the register form
     */
    private async submitRegisterForm(): Promise<void> {
        try {
            if (
                !this.validateName() ||
                !this.validateEmail() ||
                !this.validatePassword() ||
                !this.validateRepeatPassword()
            ) {
                return;
            }

            const usermodel: UserRegisterFormModel = {
                email: this._email,
                password: this._password,
                username: this._name,
                dateCreated: new Date().toISOString().split("T")[0],
                dateOfBirth: new Date(this._dateOfBirth).toISOString().split("T")[0],
                gender: this._gender,
                street: this._street,
                houseNumber: this._houseNumber,
                country: this._country,
            };

            const result: boolean = await this._userService.register(usermodel);

            if (result) {
                alert("Successfully registered!");
                this.navigateToPage(RouterPage.Login);
            } else {
                alert("Failed to register!");
            }
        } catch (error) {
            console.error("Error during registration: ", error);
            alert("An error occurred during registration. Please try again.");
        }
    }

    private validateName(): boolean {
        const regex: RegExp = /^[a-zA-Z0-9]+$/;

        // Controleren of de naam alleen letters bevat
        if (!regex.test(this._name.trim())) {
            alert("Ongeldige naam: De naam mag alleen letters bevatten.");
            return false;
        }

        console.log("Geldige naam");
        return true;
    }
    private validateEmail(): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Controleren of het e-mailadres voldoet aan het patroon
        if (!emailRegex.test(this._email.trim())) {
            alert("Ongeldig e-mailadres: Controleer of het e-mailadres correct is ingevoerd.");
            return false;
        }

        console.log("Geldig e-mailadres");
        return true;
    }
    private validatePassword(): boolean {
        // Controleren op minimale lengte van het wachtwoord
        if (this._password.length < 8) {
            alert("Ongeldig wachtwoord: Het wachtwoord moet minimaal 8 tekens lang zijn.");
            return false;
        }

        console.log("Geldig wachtwoord");
        return true;
    }
    private validateRepeatPassword(): boolean {
        // Controleren of het herhaalde wachtwoord overeenkomt met het oorspronkelijke wachtwoord
        if (this._repeatPassword !== this._password) {
            alert("Ongeldige herhaald wachtwoord: De wachtwoorden komen niet overeen.");
            return false;
        }

        console.log("Geldig herhaald wachtwoord");
        return true;
    }

    /**
     * Handler for the cart button
     */
    private async clickCartButton(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();
        window.location.href = "shoppingCart.html";
        if (!result) {
            return;
        }

        this._cartItemsCount = result.cartItems?.length || 0;

        alert(
            `Hallo ${result.email}!\r\n\r\nJe hebt de volgende producten in je winkelmandje:\r\n- ${
                result.cartItems?.join("\r\n- ") || "Geen"
            }`,
        );
    }

    /**
     * Handler for the logout button
     */
    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();

        this._tokenService.removeToken();

        this._isLoggedIn = false;
    }

    /**
     * Handler for the "Add to cart"-button
     *
     * @param orderItem Order item to add to the cart
     */
    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        console.log(orderItem.id);
        console.log(orderItem.title);
        console.log(orderItem.descriptionMarkdown);

        // Call the userService to add the orderItem to the cart
        const result: { count: number } | undefined = await this._userService.addOrderItemToCart(
            orderItem.id,
            orderItem.title,
            orderItem.price,
        );
        console.log(result);

        // Check if adding to the cart was successful
        if (!result) {
            return;
        }

        this._cartItemsCount = result.count;
    }

    /**
     * Renders the components
     */
    private isRenderingRegister = false;
    public render(): TemplateResult {
        let contentTemplate: TemplateResult | string = "";

        switch (this._currentPage) {
            case RouterPage.Login:
                contentTemplate = this.renderLogin();
                break;
            case RouterPage.ForgotPassword:
                contentTemplate = this.renderForgotPassword();
                break;
            case RouterPage.ResetPassword:
                contentTemplate = this.renderResetPassword();
                break;
            case RouterPage.Register:
                if (!this.isRenderingRegister) {
                    this.isRenderingRegister = true;
                    contentTemplate = this.renderRegister();
                    this.isRenderingRegister = false;
                }
                break;
            case RouterPage.Games:
                contentTemplate = this.renderGames();
                break;
            case RouterPage.Merchandise:
                contentTemplate = this.renderMerchandise();
                break;
            case RouterPage.GameDetails:
                contentTemplate = this.renderGameDetails(this._product);
                break;
            case RouterPage.MerchandiseDetails:
                contentTemplate = this.renderMerchandiseDetails(this._product);
                break;
            default:
                contentTemplate = this.renderHome();
        }

        return html`
            <header>
                <div class="navbar">
                    <nav>
                        <div
                            class="logo"
                            @click=${(): void => {
                                this._currentPage = RouterPage.Home;
                            }}
                        >
                            <img src="/assets/img/logo.png" alt="Logo" />
                        </div>
                        <ul class="navbar-links">
                            <div
                                class="navbar-option"
                                @click="${async (): Promise<void> => {
                                    this._currentPage = RouterPage.Games;
                                    await this.getGames();
                                }}"
                            >
                                <li><a href="#">Games</a></li>
                            </div>
                            <div
                                class="navbar-option"
                                @click="${async (): Promise<void> => {
                                    this._currentPage = RouterPage.Merchandise;
                                    await this.getMerchandise();
                                }}"
                            >
                                <li><a href="#">Merchandise</a></li>
                            </div>
                        </ul>
                        <form class="nav-search">
                            <input
                                type="text"
                                placeholder="Search"
                                class="search-bar"
                                @input=${this.onSearchInput}
                            />
                        </form>

                        ${this.renderLoginInNav()} ${this.renderRegisterInNav()} ${this.renderCartInNav()}
                        ${this.renderLogoutInNav()} ${this.renderProfile()}
                    </nav>
                </div>
            </header>
            <main>${contentTemplate}</main>
            ${this.renderFooter()}
        `;
    }

    /**
     * Renders the home page, which contains a list of all order items.
     */
    private renderHome(): TemplateResult {
        const orderItems: TemplateResult[] = this._filteredItems.map((e) => this.renderOrderItem(e));

        if (orderItems.length === 0) {
            return html`<div class="order-items">Loading... Please wait a moment.</div>`;
        }

        return html`
            <main>
                <div class="promo-banner">
                    <div class="mySlides">
                        <div class="numbertext">1 / 4</div>
                        <img src="assets/img/dragonslayer.png" style="width: 100%" />
                        <div class="gametext">Dragon Slayer</div>
                    </div>

                    <div class="mySlides">
                        <div class="numbertext">2 / 4</div>
                        <img src="assets/img/game.png" style="width: 75%" />
                        <div class="gametext">Luca Star</div>
                    </div>

                    <div class="mySlides">
                        <div class="numbertext">3 / 4</div>
                        <img src="assets/img/metro8.png" style="width: 75%" />
                        <div class="gametext">Metro8</div>
                    </div>

                    <div class="mySlides">
                        <div class="numbertext">4 / 4</div>
                        <img src="assets/img/lostmemories.png" style="width: 75%" />
                        <div class="gametext">Lost Memories</div>
                    </div>

                    <a class="prev" @click=${(): void => this.plusSlides(-1)}>&#10094;</a>
                    <a class="next" @click=${(): void => this.plusSlides(1)}>&#10095;</a>
                </div>
                <br />

                <div style="text-align:center">
                    <span class="dot" @click=${(): void => this.currentSlide(1)}></span>
                    <span class="dot" @click=${(): void => this.currentSlide(2)}></span>
                    <span class="dot" @click=${(): void => this.currentSlide(3)}></span>
                    <span class="dot" @click=${(): void => this.currentSlide(4)}></span>
                </div>

                <section class="merchandise-section">
                    <h2>Official T-shirts, hoodies, mugs and more!</h2>
                    <div class="merch-carousel">
                        <button class="carousel-btn prev-btn">❮</button>
                        <div class="merch-items">
                            <div class="merch-item">Merchandise</div>
                            <div class="merch-item">Merchandise</div>
                            <div class="merch-item">Merchandise</div>
                        </div>
                        <button class="carousel-btn next-btn">❯</button>
                    </div>
                    <button class="shop-now-btn">Shop now</button>
                </section>

                <section class="order-items-section">
                    <h1>Welcome to the Luca Stars webshop!</h1>

                    ${this._isLoggedIn
                        ? nothing
                        : html`<p>You must be logged in to add products to your cart!</p>`}

                    <div class="order-items">${orderItems}</div>
                </section>
            </main>

            <footer>
                <div class="footer-content">
                    <div class="footer-column">
                        <h3>Customer Service</h3>
                        <ul>
                            <li><a href="#">Membership</a></li>
                            <li><a href="#">Returns</a></li>
                            <li><a href="#">Payments</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Shop</h3>
                        <ul>
                            <li><a href="#">Games</a></li>
                            <li><a href="#">Merchandise</a></li>
                            <li><a href="#">Sales & deals</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Privacy</h3>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
                <div class="social-media">
                    <h2>Join our worldwide community</h2>
                    <div class="icons">
                        <a href="#"><img src="assets/icons/twitter.png" alt="Twitter" /></a>
                        <a href="#"><img src="assets/icons/facebook.png" alt="Facebook" /></a>
                        <a href="#"><img src="assets/icons/instagram.png" alt="Instagram" /></a>
                        <a href="#"><img src="assets/icons/youtube.png" alt="YouTube" /></a>
                    </div>
                </div>
            </footer>
        `;
    }

    private slideIndex: number = 1;
    private autoSlideInterval: number | undefined;

    private plusSlides(n: number): void {
        this.showSlides((this.slideIndex += n));
    }

    private currentSlide(n: number): void {
        this.showSlides((this.slideIndex = n));
    }

    private showSlides(n: number): void {
        const slides: HTMLElement[] = Array.from(this.shadowRoot!.querySelectorAll(".mySlides"));
        const dots: HTMLElement[] = Array.from(this.shadowRoot!.querySelectorAll(".dot"));

        if (!slides || !dots) {
            return;
        }

        if (n > slides.length) {
            this.slideIndex = 1;
        }
        if (n < 1) {
            this.slideIndex = slides.length;
        }
        slides.forEach((slide) => {
            slide.style.display = "none";
            slide.classList.remove("active");
        });
        dots.forEach((dot) => {
            dot.className = dot.className.replace(" active", "");
        });
        if (slides.length > 0 && dots.length > 0) {
            slides[this.slideIndex - 1].style.display = "block";
            slides[this.slideIndex - 1].classList.add("active");
            dots[this.slideIndex - 1].className += " active";
        }
    }

    private autoSlide(): void {
        this.autoSlideInterval = window.setInterval(() => {
            this.plusSlides(1);
        }, 2000);
    }

    protected firstUpdated(): void {
        this.showSlides(this.slideIndex);
        this.autoSlide();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }

    public renderProfile(): TemplateResult {
        return html`
            <ul class="navbar-links">
                <button @click=${this.referToProfile}>Profile</button>
            </ul>
        `;
    }
    public referToProfile(): any {
        window.location.href = "profile.html";
    }

    public renderBackButton(): TemplateResult {
        return this._navigationStack.length > 0
            ? html`<button @click="${this.goBack}" class="back-button">Back</button>`
            : html``;
    }

    /**
     * Renders a single order item
     *
     * @param orderItem Order item to render
     */
    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
            <div class="order-item">
                <br />
                <h2>${orderItem.id}</h2>
                <h2>${orderItem.title}</h2>
                <p>${orderItem.descriptionMarkdown}</p>
                ${orderItem.thumbnail !== null
                    ? html`<img src="${ifDefined(orderItem.thumbnail)}" width="300px" />`
                    : html`<img src="/assets/img/template.png" width="300px" />`}
                <h2>€${orderItem.price}</h2>
                ${this._isLoggedIn
                    ? html`<button @click=${async (): Promise<void> => await this.addItemToCart(orderItem)}>
                          Add To Cart
                      </button>`
                    : nothing}
            </div>
        `;
    }

    public renderForgotPassword(): TemplateResult {
        return html`
            <div>
                <h1>Forgot Password</h1>
                <div class="form">
                    <label for="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        class="login-input"
                        @input=${this.onChangeForgotPasswordEmail}
                    />
                    <p>If your account exists, you will recieve an email with your resetlink</p>
                    <button class="login-btn" @click=${this.sendForgotPasswordEmail}>Send Email</button>
                    <button class="login-btn" @click=${this.goBack}>Back</button>
                </div>
            </div>
        `;
    }

    /**
     * Renders the login page
     */
    public renderLogin(): TemplateResult {
        return html`
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Login Page</title>
                    <link rel="stylesheet" href="style.css" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
                        rel="stylesheet"
                    />
                </head>
                <body>
                    <div class="wrapper">
                        <section class="login-section">
                            <h1>Login to your personal account</h1>
                            <div class="form-login">
                                ${this.renderEmail()} ${this.renderPassword()}

                                <div></div>
                                <div>
                                    <a href="#" class="link" @click="${this.onClickForgotPassword}"
                                        >Forgot your password?</a
                                    ><br />
                                    <button
                                        class="login-button"
                                        @click="${this.submitLoginForm}"
                                        type="submit"
                                    >
                                        Login
                                    </button>
                                    <span class="text-divider">or</span>
                                    <button class="big-button">
                                        <a href="register.html" type="submit" class="button"
                                            >Create an account</a
                                        >
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </body>
            </html>
        `;
    }

    /**
     * Renders the register page
     */
    public renderRegister(): TemplateResult {
        return html`
            <div class="createAccountText"><h1>Create a personal account</h1></div>
            <div class="form-register">
                <div></div>
                ${this.renderUsername()} ${this.renderEmail()}
                ${this.renderPassword()}${this.repeatPassword()}${this.dateOfBirth()}${this.gender()}${this.street()}${this.houseNumber()}${this.country()}
                <div>
                    <button
                        class="register-btn"
                        @click="${(): any => this.submitRegisterForm()}"
                        type="button"
                    >
                        Create account
                    </button>
                </div>
            </div>
            <div></div>
        `;
    }

    /**
     * Renders the login button in the navigation
     */
    private renderLoginInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Login;
            }}
        >
            <button>Login</button>
        </div>`;
    }

    /**
     * Renders the register button in the navigation
     */
    private renderRegisterInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html` <div
            @click=${(): void => {
                this._currentPage = RouterPage.Register;
            }}
        >
            <button>Register</button>
        </div>`;
    }

    /**private renderAdminInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html` <div
            @click=${(): void => {
                this._currentPage = RouterPage.Admin;
            }}
        >
            <button>Admin</button>
        </div>`;
    }*/

    /**
     * Renders the cart button in the navigation
     */
    private renderCartInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div @click=${this.clickCartButton}>
            <img src="/assets/img/cartIcon.png" width="20px" height="20px" alt="Shopping Cart Icon" />
        </div>`;
    }

    /**
     * Renders the logout button in the navigation
     */
    private renderLogoutInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`
            <div @click=${this.clickLogoutButton}>
                <button>Logout</button>
            </div>
        `;
    }

    private renderUsername(): TemplateResult {
        return html` <div>
            <label for="username">Username</label>
            <input
                type="text"
                class="login-input"
                id="name"
                value=${this._name}
                @input=${(event: InputEvent): void => this.onChangeName(event)}
                aria-labelledby="username-label"
            />
        </div>`;
    }
    /**
     * Renders the e-mail input field with change-tracking
     */
    private renderEmail(): TemplateResult {
        return html`<div>
            <label for="email">E-mail</label>
            <input
                class="login-input"
                type="text"
                name="email"
                placeholder="E-mail"
                value=${this._email}
                @input=${(event: InputEvent): void => this.onChangeEmail(event)}
            />
        </div>`;
    }

    /**
     * Renders the password input field with change-tracking
     */
    private renderPassword(): TemplateResult {
        return html`<div>
            <label for="password">Password</label>
            <input
                type="password"
                class="login-input"
                placeholder="Password"
                value=${this._password}
                @change=${this.onChangePassword}
                @input=${(event: InputEvent): void => this.onChangePassword(event)}
            />
        </div>`;
    }
    private repeatPassword(): TemplateResult {
        return html`<div>
            <label for="repeatPassword"></label>
            <input
                type="password"
                placeholder="Repeat password"
                class="login-input"
                @input=${(event: InputEvent): void => this.onChangeRepeatPassword(event)}
            />
        </div>`;
    }
    private dateOfBirth(): TemplateResult {
        return html`<div>
            <label for="dateOfBirth"></label>
            <input
                type="date"
                placeholder="Date of birth"
                class="login-input"
                @input=${(event: InputEvent): void => this.onChangeDateOfBirth(event)}
            />
        </div>`;
    }

    private gender(): TemplateResult {
        return html`<div>
            <label for="gender">Gender:</label>
            <select id="gender" @change="${this.onChangeGender}">
                <option value="" selected disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>`;
    }

    private street(): TemplateResult {
        return html`<div>
            <label for="street"></label>
            <input
                type="text"
                placeholder="Street"
                class="login-input"
                @input=${(event: InputEvent): void => this.onChangeStreet(event)}
            />
        </div>`;
    }
    private houseNumber(): TemplateResult {
        return html`<div>
            <label for="houseNumber"></label>
            <input
                type="text"
                placeholder="House number"
                class="login-input"
                @input=${(event: InputEvent): void => this.onChangeHouseNumber(event)}
            />
        </div>`;
    }
    private country(): TemplateResult {
        return html`<div>
            <label for="country"></label>
            <input
                type="text"
                placeholder="Country"
                class="login-input"
                @input=${(event: InputEvent): void => this.onChangeCountry(event)}
            />
        </div>`;
    }

    private renderResetPassword(): TemplateResult {
        return html`<reset-password></reset-password>`;
    }

    /**
     * Renders the games page
     */
    private renderGames(): TemplateResult {
        return html`
            <div class="wrapper">
                ${this.renderGamesFilterBar()}

                <section class="product-section">
                    ${this._filteredItems.length > 0
                        ? this._filteredItems.map(
                              (item) => html`
                                  <div class="product">
                                      ${item.thumbnail !== null
                                          ? html`<img
                                                src="${ifDefined(item.thumbnail)}"
                                                width="300px"
                                                @click=${(): void => {
                                                    this.getProductId(item);
                                                    this._currentPage = RouterPage.GameDetails;
                                                }}
                                            />`
                                          : html`<img
                                                src="/assets/img/template.png"
                                                @click=${(): void => {
                                                    this.getProductId(item);
                                                    this._currentPage = RouterPage.GameDetails;
                                                }}
                                            />`}
                                      ${item.title.length >= 31
                                          ? html` <h3>${item.title.slice(0, 31)}...</h3> `
                                          : html` <h3>${item.title}</h3> `}
                                      <div class="buttons">
                                          ${this._isLoggedIn
                                              ? html`<button
                                                    class="more-info-button"
                                                    @click=${async (): Promise<void> => {
                                                        await this.addItemToCart(item);
                                                        window.location.href = "shoppingCart.html";
                                                    }}
                                                >
                                                    Buy now
                                                </button>`
                                              : html`<button
                                                    class="more-info-button"
                                                    @click=${(): void => {
                                                        this.getProductId(item);
                                                        this._currentPage = RouterPage.GameDetails;
                                                    }}
                                                >
                                                    More Info
                                                </button>`}
                                          <span class="base-price">€ ${item.price},-</span>
                                      </div>
                                      ${this._isLoggedIn
                                          ? html`<button
                                                class="add-to-cart-button"
                                                @click=${async (): Promise<void> =>
                                                    await this.addItemToCart(item)}
                                            >
                                                To Cart
                                            </button>`
                                          : nothing}
                                  </div>
                              `,
                          )
                        : html`<div class="order-items">Loading... Please wait a moment.</div>`}
                </section>
            </div>
        `;
    }

    /**
     * Renders the merchandise page
     */
    public renderMerchandise(): TemplateResult {
        return html`
            <div class="wrapper">
                ${this.renderMerchFilterBar()}

                <section class="product-section">
                    ${map(
                        this._filteredItems,
                        (item) => html`
                            <div class="product">
                                <img
                                    class="merch-game"
                                    src="${this.merchArray[item.id - 1].image}"
                                    width="300px"
                                    @click=${(): void => {
                                        this.getProductId(item);
                                        this._currentPage = RouterPage.MerchandiseDetails;
                                    }}
                                />
                                ${item.title.length >= 31
                                    ? html` <h3>${item.title.slice(0, 31)}...</h3> `
                                    : html` <h3>${item.title}</h3> `}
                                <div class="buttons">
                                    ${this._isLoggedIn
                                        ? html`<button
                                              class="more-info-button"
                                              @click=${async (): Promise<void> => {
                                                  await this.addItemToCart(item);
                                                  window.location.href = "shoppingCart.html";
                                              }}
                                          >
                                              Buy now
                                          </button>`
                                        : html`<button
                                              class="more-info-button"
                                              @click=${(): void => {
                                                  this.getProductId(item);
                                                  this._currentPage = RouterPage.MerchandiseDetails;
                                              }}
                                          >
                                              More Info
                                          </button>`}
                                    <span class="base-price">€ ${item.price},-</span>
                                </div>
                                ${this._isLoggedIn
                                    ? html`<button
                                          class="add-to-cart-button"
                                          @click=${async (): Promise<void> => await this.addItemToCart(item)}
                                      >
                                          To Cart
                                      </button>`
                                    : nothing}
                            </div>
                        `,
                    )}
                </section>
            </div>
        `;
    }

    private renderGamesFilterBar(): TemplateResult {
        return html`
            <ul class="product-filter">
                <li><span class="filter-title">Filter: </span></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Genre</a></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Rating</a></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Name</a></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Price</a></li>
            </ul>
            <div ?hidden=${!this._genreIsClicked}>
                <p class="choose-option">Genre(s):</p>
                <select class="filter-option">
                    <option @click=${this.useGamesFilter}>Choose</option>
                    <option @click=${this.useGamesFilter}>Action</option>
                    <option @click=${this.useGamesFilter}>Adventure</option>
                    <option @click=${this.useGamesFilter}>Horror</option>
                    <option @click=${this.useGamesFilter}>Comedy</option>
                    <option @click=${this.useGamesFilter}>Drama</option>
                    <option @click=${this.useGamesFilter}>Sci-Fi</option>
                    <option @click=${this.useGamesFilter}>Mystery</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Genre Filter</a>
            </div>
            <div ?hidden=${!this._ratingIsClicked}>
                <p class="choose-option">Rating:</p>
                <select class="filter-option">
                    <option @click=${this.useGamesFilter}>Choose</option>
                    <option @click=${this.useGamesFilter}>Highlighted</option>
                    <option @click=${this.useGamesFilter}>Runner-up</option>
                    <option @click=${this.useGamesFilter}>Highlighted And Runner-up</option>
                    <option @click=${this.useGamesFilter}>Runner-up And Highlighted</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Rating Filter</a>
            </div>
            <div ?hidden=${!this._nameIsClicked}>
                <p class="choose-option">Name:</p>
                <select class="filter-option">
                    <option @click=${this.useGamesFilter}>Choose</option>
                    <option @click=${this.useGamesFilter}>Ascending (A-Z)</option>
                    <option @click=${this.useGamesFilter}>Descending (Z-A)</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Name Filter</a>
            </div>
            <div ?hidden=${!this._priceIsClicked}>
                <p class="choose-option">Price:</p>
                <select class="filter-option">
                    <option @click=${this.useGamesFilter}>Choose</option>
                    <option @click=${this.useGamesFilter}>Highest To Lowest</option>
                    <option @click=${this.useGamesFilter}>Lowest To Highest</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Price Filter</a>
            </div>
        `;
    }

    private renderMerchFilterBar(): TemplateResult {
        return html`
            <ul class="product-filter">
                <li><span class="filter-title">Filter: </span></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Genre</a></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Rating</a></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Name</a></li>
                <li class="filter-bar" @click=${this.renderFilterDropdown}><a href="#">Price</a></li>
            </ul>
            <div ?hidden=${!this._genreIsClicked}>
                <p class="choose-option">Genre(s):</p>
                <select class="filter-option">
                    <option @click=${this.useMerchFilter}>Choose</option>
                    <option @click=${this.useMerchFilter}>Action</option>
                    <option @click=${this.useMerchFilter}>Adventure</option>
                    <option @click=${this.useMerchFilter}>Horror</option>
                    <option @click=${this.useMerchFilter}>Comedy</option>
                    <option @click=${this.useMerchFilter}>Drama</option>
                    <option @click=${this.useMerchFilter}>Sci-Fi</option>
                    <option @click=${this.useMerchFilter}>Mystery</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Genre Filter</a>
            </div>
            <div ?hidden=${!this._ratingIsClicked}>
                <p class="choose-option">Rating:</p>
                <select class="filter-option">
                    <option @click=${this.useMerchFilter}>Choose</option>
                    <option @click=${this.useMerchFilter}>Highlighted</option>
                    <option @click=${this.useMerchFilter}>Runner-up</option>
                    <option @click=${this.useMerchFilter}>Highlighted And Runner-up</option>
                    <option @click=${this.useMerchFilter}>Runner-up And Highlighted</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Rating Filter</a>
            </div>
            <div ?hidden=${!this._nameIsClicked}>
                <p class="choose-option">Name:</p>
                <select class="filter-option">
                    <option @click=${this.useMerchFilter}>Choose</option>
                    <option @click=${this.useMerchFilter}>Ascending (A-Z)</option>
                    <option @click=${this.useMerchFilter}>Descending (Z-A)</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Name Filter</a>
            </div>
            <div ?hidden=${!this._priceIsClicked}>
                <p class="choose-option">Price:</p>
                <select class="filter-option">
                    <option @click=${this.useMerchFilter}>Choose</option>
                    <option @click=${this.useMerchFilter}>Highest To Lowest</option>
                    <option @click=${this.useMerchFilter}>Lowest To Highest</option>
                </select>
                <a class="clear-filter" @click=${this.clearFilter}>Clear Price Filter</a>
            </div>
        `;
    }

    private getProductId(orderItem: OrderItem): void {
        console.log(this._product);
        this._product = orderItem;
    }

    public renderGameDetails(item: OrderItem): TemplateResult {
        return html`
            <section class="product-details">
                <h2 class="title-details">${item.title}</h2>
                <div class="banner">
                    ${item.thumbnail !== null
                        ? html`<img src="${ifDefined(item.thumbnail)}" />`
                        : html`<img src="/assets/img/template.png" }} />`}
                </div>
                <div class="buttons-details">
                    <div>
                        <span class="base-price-details">€ ${item.price},-</span>
                    </div>
                    <div>
                        ${this._isLoggedIn
                            ? html`<button
                                  class="add-to-cart-details"
                                  @click=${async (): Promise<void> => await this.addItemToCart(item)}
                              >
                                  To Cart
                              </button> `
                            : nothing}
                    </div>
                </div>
                <div class="details">
                    <div class="extra details">
                        <h3 class="detail-text">Description:</h3>
                        <p>${item.descriptionMarkdown}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Game Demo:</h3>
                        <a href="${ifDefined(item.url)}">${item.url}</a>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Developers:</h3>
                        <p>${item.authors?.replace("[", "").replace("]", "").replace(/"/g, "")}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Tag(s):</h3>
                        <p>${item.tags?.replace("[", "").replace("]", "").replace(/"/g, "")}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Age Rating:</h3>
                        <p>${item.ageRating}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Genre(s):</h3>
                        <p>${item.genre}</p>
                    </div>
                </div>

                <h3 class="detail-text">Preview:</h3>
                <div>
                    ${item.images !== null
                        ? html`
                              ${item.images
                                  ?.replace(/"/g, "")
                                  .replace(/\[/g, "")
                                  .replace(/\]/g, "")
                                  .replace(/\,/g, "")
                                  .replace(/"/g, "")
                                  .split(" ")
                                  .map((images) => html` <img class="gallery" src="${images}" /> `)}
                          `
                        : html` <img class="gallery" src="/assets/img/template.png" /> `}
                </div>
            </section>
        `;
    }

    public renderMerchandiseDetails(item: OrderItem): TemplateResult {
        return html`
            <section class="product-details">
                <h2 class="title-details">${item.title}</h2>
                <div class="banner">
                    <img class="merch" src="${this.merchArray[item.id - 1].image}" />
                </div>
                <h3>Een ${item.title} voor al je gaming needs.</h3>
                <div class="buttons-details">
                    <div>
                        <span class="base-price-details">€ ${item.price},-</span>
                    </div>
                    <div>
                        ${this._isLoggedIn
                            ? html`<button
                                  class="add-to-cart-details"
                                  @click=${async (): Promise<void> => await this.addItemToCart(item)}
                              >
                                  To Cart
                              </button> `
                            : nothing}
                    </div>
                </div>
                <div class="details">
                    <div class="extra details">
                        <h3 class="detail-text">Description:</h3>
                        <p>${item.descriptionMarkdown}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Game Page:</h3>
                        <a
                            @click=${():void => {
                                this.getProductId(item);
                                this._currentPage = RouterPage.GameDetails;
                            }}
                        >
                            Purchase the game here.</a>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Developers:</h3>
                        <p>${item.authors?.replace("[", "").replace("]", "").replace(/"/g, "")}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Tag(s):</h3>
                        <p>${item.tags?.replace("[", "").replace("]", "").replace(/"/g, "")}</p>
                    </div>

                    <div class="extra details">
                        <h3 class="detail-text">Genre(s):</h3>
                        <p>${item.genre}</p>
                    </div>
                </div>

                <h3 class="detail-text">Preview Game:</h3>
                <div>
                    ${item.images !== null
                        ? html`
                              ${item.images
                                  ?.replace(/"/g, "")
                                  .replace(/\[/g, "")
                                  .replace(/\]/g, "")
                                  .replace(/\,/g, "")
                                  .replace(/"/g, "")
                                  .split(" ")
                                  .map((images) => html` <img class="gallery" src="${images}" /> `)}
                          `
                        : html` <img class="gallery" src="/assets/img/template.png" /> `}
                </div>
            </section>
        `;
    }

    public renderFilterDropdown(event: any): void {
        const filter: any = event.target;
        const filterOption: string = filter.textContent;
        this._product.orderBy = filterOption;
        console.log(this._product);

        if (filterOption !== "Genre") {
            this._genreIsClicked = false;
        } else {
            this._genreIsClicked = true;
        }

        if (filterOption !== "Rating") {
            this._ratingIsClicked = false;
        } else {
            this._ratingIsClicked = true;
        }

        if (filterOption !== "Name") {
            this._nameIsClicked = false;
        } else {
            this._nameIsClicked = true;
        }

        if (filterOption !== "Price") {
            this._priceIsClicked = false;
        } else {
            this._priceIsClicked = true;
            // window.history.pushState(null, document.title, "products?orderBy=price");
        }
    }

    public async clearFilter(event: any): Promise<void> {
        const filter: any = event.target;
        const clearFilter: string = filter.textContent;
        this._product.sortOrder = clearFilter;
        console.log(this._product);

        console.log(clearFilter);

        if (clearFilter === "Clear Genre Filter") {
            this._genreIsClicked = false;
        }

        if (clearFilter === "Clear Rating Filter") {
            this._ratingIsClicked = false;
        }

        if (clearFilter === "Clear Name Filter") {
            this._nameIsClicked = false;
        }

        if (clearFilter === "Clear Price Filter") {
            this._priceIsClicked = false;
        }

        await this.getOrderItems();
    }

    public async useGamesFilter(event: any): Promise<void> {
        const filter: any = event.target;
        const categoryFilter: string = filter.value;
        this._product.sortOrder = categoryFilter;
        console.log(this._product);

        if (categoryFilter) {
            await this.getGames();
        }

        this.updateFilteredItems();
    }

    public async useMerchFilter(event: any): Promise<void> {
        const filter: any = event.target;
        const categoryFilter: string = filter.value;
        this._product.sortOrder = categoryFilter;
        console.log(this._product);

        if (categoryFilter) {
            await this.getMerchandise();
        }

        this.updateFilteredItems();
    }

    public renderFooter(): TemplateResult {
        return html`
            <footer>
                <div class="footer-content">
                    <div class="footer-column">
                        <h3>Customer Service</h3>
                        <ul>
                            <li><a href="#" class="footer-link">Membership</a></li>
                            <li><a href="#" class="footer-link">Returns</a></li>
                            <li><a href="#" class="footer-link">Payments</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Shop</h3>
                        <ul>
                            <li><a href="#" class="footer-link">Games</a></li>
                            <li><a href="#" class="footer-link">Merchandise</a></li>
                            <li><a href="#" class="footer-link">Sales & deals</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Privacy</h3>
                        <ul>
                            <li><a href="#" class="footer-link">Privacy Policy</a></li>
                            <li><a href="#" class="footer-link">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        `;
    }
    /**
     * Handles changes to the e-mail input field
     */
    private onChangeEmail(event: InputEvent): void {
        this._email = (event.target as HTMLInputElement).value;
    }

    private onClickForgotPassword(): void {
        this.navigateToPage(RouterPage.ForgotPassword);
    }

    private onChangeForgotPasswordEmail(event: InputEvent): void {
        this._forgotPasswordEmail = (event.target as HTMLInputElement).value;
    }

    private updateFilteredItems(): void {
        let items: OrderItem[] = [...this._orderItems];

        if (this._searchQuery) {
            items = items.filter((item) => item.title.toLowerCase().includes(this._searchQuery));
        }

        // if (this._ascendingTitle) {
        //     items.sort((a, b) => a.title.localeCompare(b.title));
        // } else if (this._descendingTitle) {
        //     items.sort((a, b) => b.title.localeCompare(a.title));
        // }

        // if (this._ascendingPrice) {
        //     items.sort((a, b) => a.price - b.price);
        // } else if (this._descendingPrice) {
        //     items.sort((a, b) => b.price - a.price);
        // }

        this._filteredItems = items;
    }

    public onSearchInput(event: Event): void {
        const input: string = (event.target as HTMLInputElement).value.toLowerCase();
        this._searchQuery = input;
        this.updateFilteredItems();
    }

    private async sendForgotPasswordEmail(): Promise<void> {
        const email: string = this._forgotPasswordEmail;
        if (!email) {
            alert("Please enter an email address");
            return;
        }

        // Check if the email exists and get the user_id
        const userExists: boolean = await this._userService.checkIfEmailExists(email);
        const user_id: number | undefined = await this._userService.getUserId(email);

        if (!userExists || !user_id) {
            alert("If the email exists, you will receive an email with a reset link.");
            return;
        }

        console.log("User_id: ", user_id);

        // Generate reset link here
        const tokenResponse: { token: string } | undefined = await this._userService.generateJwtToken(email);
        if (!tokenResponse || !tokenResponse.token) {
            alert("Failed to generate reset token");
            return;
        }

        await this._userService.setToken(user_id, tokenResponse.token);

        const resetLink: string = `http://localhost:3000/reset-password?token=${tokenResponse.token}`;

        // Send the email with the reset link
        const success: boolean = await this._userService.resetLink(email, resetLink);

        console.log("Email: ", email, "success: ", success);
        if (success) {
            console.log("Email sent to: ", email);
            alert("If the email exists, you will receive an email with a reset link.");
        } else {
            alert("Failed to send email");
        }
    }

    /**
     * Handles changes to the password input field
     */
    private onChangePassword(event: InputEvent): void {
        this._password = (event.target as HTMLInputElement).value;
    }
    private onChangeRepeatPassword(event: InputEvent): void {
        this._repeatPassword = (event.target as HTMLInputElement).value;
    }
    /**
     * Handles changes to the name input field
     */
    private onChangeName(event: InputEvent): void {
        this._name = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the gender input field
     */
    private onChangeGender(event: Event): void {
        const selectElement: HTMLSelectElement = event.target as HTMLSelectElement;
        this._gender = selectElement.value || "";
    }

    /**
     * Handles changes to the house number input field
     */
    private onChangeHouseNumber(event: InputEvent): void {
        this._houseNumber = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the country input field
     */
    private onChangeCountry(event: InputEvent): void {
        this._country = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the street input field
     */
    private onChangeStreet(event: InputEvent): void {
        this._street = (event.target as HTMLInputElement).value;
    }
    /**
     * Handles changes to the date of birth input field
     */
    private onChangeDateOfBirth(event: InputEvent): void {
        this._dateOfBirth = (event.target as HTMLInputElement).value;
    }
}
