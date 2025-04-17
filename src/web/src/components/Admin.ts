import { html, css, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("webshop-admin")
export class admin extends LitElement {
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

        .wrapper {
            padding: 18px;
            min-height: 90vh;
        }

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
            text-transform: capitalize;
        }

        /* Responsive styles */
        @media (min-width: 576px) {
            .footer-column {
                border-width: 2px;
                padding: 0px 10px;
            }

            .logo {
                max-width: 15vw;
            }
        }

        @media (min-width: 768px) {
            footer,
            .wrapper {
                padding: 39px;
            }

            .logo {
                max-width: 12vw;
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

        @media (min-width: 992px) {
            .footer-column h3 {
                font-size: 24px;
            }

            .login-btn {
                padding: 0 40px;
            }
        }

        @media (min-width: 1200px) {
            .footer-column h3 {
                font-size: 24px;
            }

            .footer-column {
                border-width: 4px;
                padding: 0px 40px;
            }

            .footer-link {
                font-size: 24px;
            }

            h1 {
                font-size: 48px;
                margin: 30px;
            }

            .login-btn {
                padding: 0 45px;
            }
        }
    `;

    private renderHeader(): TemplateResult {
        return html`
            <header>
                <nav>
                    <div class="logo">
                        <img src="logo.png" alt="Logo" />
                    </div>
                    <div class="navbar-links">
                        <a href="#">Dashboard</a>
                        <a href="#">Products</a>
                        <a href="#">Orders</a>
                        <a href="#">Users</a>
                    </div>
                </nav>
            </header>
        `;
    }

    private renderMain(): TemplateResult {
        return html`
            <main>
                <div class="form">
                    <h1>Admin Panel</h1>
                    <label for="admin">Admin:</label>
                    <input type="text" id="admin" name="admin" class="login-admin" placeholder="admin" />
                    <label for="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="login-admin"
                        placeholder="password"
                    />
                    <button class="login-btn">Login</button>
                </div>
            </main>
        `;
    }

    private renderFooter(): TemplateResult {
        return html`
            <footer>
                <div class="footer-content">
                    <div class="footer-column">
                        <h3>About Us</h3>
                        <ul>
                            <li><a href="#" class="footer-link">Company Info</a></li>
                            <li><a href="#" class="footer-link">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Help</h3>
                        <ul>
                            <li><a href="#" class="footer-link">FAQ</a></li>
                            <li><a href="#" class="footer-link">Support</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        `;
    }

    public render(): TemplateResult {
        return html`
            <div class="wrapper">${this.renderHeader()} ${this.renderMain()} ${this.renderFooter()}</div>
        `;
    }
}
