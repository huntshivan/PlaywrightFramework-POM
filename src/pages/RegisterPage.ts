import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class RegisterPage extends BasePage {
    private readonly registerPageHeader;
    private readonly firstNameField;
    private readonly lastNameField;
    private readonly emailField;
    private readonly telephoneField;
    private readonly passwordField;
    private readonly confirmPasswordField;
    private readonly subscribeNoBtn;
    private readonly continueBtn;
    private readonly registrationErrorMessage;

    constructor(page: Page) {
        super(page);
        this.registerPageHeader = page.getByRole('heading', {name: 'Register Account', level: 1});
        this.firstNameField = page.getByRole('textbox', {name: 'First Name'});
        this.lastNameField = page.getByRole('textbox', {name: 'Last Name'});
        this.emailField = page.getByRole('textbox', {name: 'E-mail'});
        this.telephoneField = page.getByPlaceholder('Telephone');
        this.passwordField = page.getByPlaceholder('Password').first();
        this.confirmPasswordField = page.getByPlaceholder('Password Confirm');
        this.subscribeNoBtn = page.getByRole('radio', {name: 'No'});
        this.continueBtn = page.getByRole('button', {name: 'Continue'});
        this.registrationErrorMessage = page.locator('.alert.alert-danger.alert-dismissible');

    }

    async registerPageTitle(): Promise<string> {
        return await this.page.title();
    }

    registerPageURL(): string {
        return this.page.url();
    }

    async isRegisterAccountHeaderDisplayed(): Promise<boolean> {
        return this.registerPageHeader.isVisible() 
    }

    async doRegistration(fname:string, lname:string, email:string, phone:string, password:string) {
        await this.firstNameField.fill(fname);
        await this.lastNameField.fill(lname);
        await this.emailField.fill(email);
        await this.telephoneField.fill(phone);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(password);
        await this.subscribeNoBtn.click();
        await this.continueBtn.click();
    }

    async isRegistrationErrorMessageDisplayed(): Promise<boolean> {
        return this.registrationErrorMessage.isVisible();
    }





}