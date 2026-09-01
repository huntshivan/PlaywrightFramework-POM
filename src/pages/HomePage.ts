import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {

    private readonly logoutLink: Locator;
    private readonly accountLinkHeader: Locator;
    private readonly homePageSections: Locator;

    constructor(page: Page) {
        super(page);
        this.logoutLink = page.getByRole('link', {name: 'Logout'});
        this.accountLinkHeader = page.getByRole('link', {name: 'Account', exact: true});
        this.homePageSections = page.getByRole('heading', {level: 2});
    }

    async getHomePageTitle(): Promise<string> {
        return await this.page.title();
    }

    getHomePageURL(): string {
        return this.page.url();
    }

    async isLogoutLinkVisible(): Promise<boolean> {
        return await this.logoutLink.isVisible();
    }

    async gethomePageLinkHeader(): Promise<string> {
        return await this.accountLinkHeader.innerText();
    }

    async getHomePageSectionCount(): Promise<number> {
        return await this.homePageSections.count();
    }

    async getHomePageSectionNames(): Promise<string[]> {
        return await this.homePageSections.allInnerTexts();
    }
}