import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { HomePage } from "../src/pages/HomePage";

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    homePage = new HomePage(page);
});

test('login page title test', async() => {
    let actualLoginPageTitle: string = await loginPage.loginPageTitle();
    console.log(`Login Page Title: ${actualLoginPageTitle}`);
    expect(actualLoginPageTitle).toBe('Account Login');
});

test('login page url test', async() => {
    let actualLoginPageURL = loginPage.loginPageURL();
    console.log(`Login Page URL: ${actualLoginPageURL}`);
    expect(actualLoginPageURL).toContain('route=account/login');
});

test('Forgotten Password link displayed test', async() => {
    expect(loginPage.isForgottenPasswordLinkVisible).toBeTruthy();
});

test('user successful login test', async() => {
    await loginPage.doLogin('shivansharma07@gmail.com', 'Selenium@12345');
    expect(await homePage.isLogoutLinkVisible()).toBeTruthy();
    expect(await homePage.getHomePageTitle()).toBe('My Account');
})