import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("reset-password")
export class ResetPasswordPage extends LitElement {
    @property({ type: String }) public token: string | null = null;
    @property({ type: String }) public password: string = "";
    @property({ type: String }) public confirmPassword: string = "";

    public static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: Arial, sans-serif;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .logo {
            margin-bottom: 20px;
        }

        h1 {
            color: #ecae20;
            font-size: 2em;
            margin-bottom: 20px;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 300px;
        }

        .form input {
            padding: 10px;
            font-size: 1em;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .form button {
            padding: 10px;
            font-size: 1em;
            background-color: #373e98;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .form button:hover {
            background-color: #2c2f6b;
        }
    `;

    public connectedCallback(): void {
        super.connectedCallback();
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get("token");
    }

    private checkFields(): boolean {
        return this.password !== "" && this.confirmPassword !== "";
    }

    private onPasswordChange(e: Event): void {
        this.password = (e.target as HTMLInputElement).value;
    }

    private onConfirmPasswordChange(e: Event): void {
        this.confirmPassword = (e.target as HTMLInputElement).value;
    }

    private async submitResetPassword(): Promise<void> {
        if (!this.checkFields()) {
            alert("Please fill in all fields");
            return;
        }

        if (this.password !== this.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!this.token) {
            alert("Invalid token");
            return;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: this.token, password: this.password }),
        });

        if (response.ok) {
            alert("Password reset successfully");
            window.location.href = "/";
        } else {
            alert("Failed to reset password");
        }
    }

    public render(): TemplateResult {
        return html`
            <div>
                <h1>Reset Password</h1>
                <div class="form">
                    <label for="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="New Password"
                        @input=${this.onPasswordChange}
                    />
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        @input=${this.onConfirmPasswordChange}
                    />
                    <button @click=${this.submitResetPassword}>Set Password</button>
                </div>
            </div>
        `;
    }
}
