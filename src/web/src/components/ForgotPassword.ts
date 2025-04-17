import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators";
import { Root } from "./Root";

@customElement("forgot-password")
export class ForgotPassword extends LitElement {
    private rootInstance: Root = new Root();

    public renderForgotPassword(): TemplateResult {
        const forgotPasswordTemplate: TemplateResult = this.rootInstance.renderForgotPassword();
        return html`${forgotPasswordTemplate}`;
    }
}
