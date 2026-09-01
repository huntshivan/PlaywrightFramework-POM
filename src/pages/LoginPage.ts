import { Locator, Page } from "@playwright/test";    
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {

    //private locators
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly forgottenPassword: Locator;

    //constructor of class...init page locators
    constructor(page: Page) {
        super(page);
        this.emailId = page.getByRole('textbox', {name: 'E-Mail Address'});
        this.password = page.getByRole('textbox', {name: 'Password'});
        this.loginBtn = page.getByRole('button', {name: 'Login'});
        this.forgottenPassword = page.getByRole('link', {name: 'Forgotten Password'}).first();
    }
    
    async goToLoginPage() {
        await this.page.goto('opencart/index.php?route=account/login', {waitUntil: 'load'});
    }

    async loginPageTitle(): Promise<string> {
        return await this.page.title();
    }

    loginPageURL(): string {
        return this.page.url();
    }

    async isForgottenPasswordLinkVisible(): Promise<boolean> {
        return await this.forgottenPassword.isVisible();
    }

    async doLogin(email: string, password: string) {
        await this.emailId.fill(email);
        await this.password.fill(password);
        console.log(`Email id entered is ${email} and password entered is ${password}`);
        await this.loginBtn.click();

    }

}