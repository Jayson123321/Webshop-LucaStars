import { html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { profileDetails } from "@shared/types/profile";

@customElement("webshop-profile")
export class Profile extends LitElement {

    @state()
    private _userService: UserService = new UserService();

    @state()
    private _profileDetails: profileDetails[] = [];

    protected async firstUpdated(): Promise<void> {
        await this.getProfileDetails();
    }

    protected render(): TemplateResult {
        return html`
            <style>
                
                .container {
                    background-color: #ffffff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                    font-family: Arial, sans-serif;
                }
 
                .welcome-message {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
 
                .data {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
 
                .profile-item {
                    margin-bottom: 10px;
                    font-size: 18px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: #f1f1f1;
                    padding: 10px 20px;
                    border-radius: 8px;
                    width: 80%;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }
 
                .profile-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
 
                .profile-value {
                    color: #555;
                }
 
                .editbutton {
                    color: #250505;
                }
                .edit-button{
                    color: #fff;
                    background-color: #007BFF;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 20px;
                    font-size: 16px;
                }

                .edit-button:hover {
                    background-color: #0056b3;
                }

                .delete-button {
                    background-color: #ff0000;
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 20px;
                    font-size: 16px;
                }

                .delete-button:hover {
                    background-color: #b30000;
                }

            </style>
          <div class="container">
    <div class="welcome-message">Your profile</div>
    <div class="data">
        <div class="profile-item">
            <div class="profile-label">Name:</div>
            <div class="profile-value">${this._profileDetails?.[0]?.username}</div>
        </div>
        <div class="profile-item">
            <div class="profile-label">Email:</div>
            <div class="profile-value">${this._profileDetails?.[0]?.email}</div>
        </div>
        <div>
            <ul>
                <button class="edit-button" @click=${this.redirectToProfile}>Back</button>
                <button class="delete-button" id="deleteAccountButton" @click=${this.userDelete}>Delete Account</button>
            </ul>
        </div>
    </div>
</div>

        `;
    }

    private async getProfileDetails(): Promise<void> {
            const result: profileDetails[] | undefined = await this._userService.getProfileDetails();      

            if (!result) {
                return;
            }
            this._profileDetails = result;
            console.log(this._profileDetails);
    }
    
    private async userDelete(): Promise<void> {
        try {
            await this._userService.deleteUser();
            // Voer hier acties uit na het succesvol verwijderen van de gebruiker, zoals een bericht weergeven aan de gebruiker of doorverwijzen naar een andere pagina
        } catch (error) {
            console.error(error);
            // Voer hier acties uit in het geval van een fout, zoals het tonen van een foutmelding aan de gebruiker
        }
    }
    


    private redirectToProfile(): void {
        window.location.href = "index.html";
    }

}