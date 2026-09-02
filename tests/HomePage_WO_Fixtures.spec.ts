import { test, expect } from "@playwright/test";
import { HomePage } from "../src/pages/HomePage";
import { LoginPage } from "../src/pages/LoginPage";

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async({page}) => {
    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.EMAIL_ID!, process.env.PASSWORD!);
    homePage = new HomePage(page);
})

test('home page title test', async() => {
    let actualHomePageTitle = await homePage.getHomePageTitle();
    console.log(`Home Page title is ${actualHomePageTitle}`);
    expect(actualHomePageTitle).toBe('My Account');
});

test('home page url test', async() => {
    let actualHomePageURL = homePage.getHomePageURL();
    console.log(`Home Page url is ${actualHomePageURL}`);
    expect(actualHomePageURL).toContain('route=account/account');
});

test('logout link displayed test', async() => {
    expect(homePage.isLogoutLinkVisible).toBeTruthy();
});

test('home page account header test', async() => {
    let actualHomePageLinkHeader = await homePage.gethomePageLinkHeader();
    console.log(`Home Page header link is ${actualHomePageLinkHeader}`);
    expect(actualHomePageLinkHeader).toBe('Account');
});

test('home page section count test', async() => {
    let actualHomePageSectionCount = await homePage.getHomePageSectionCount();
    console.log(`Total number of sections in home page is ${actualHomePageSectionCount}`);
    expect(actualHomePageSectionCount).toBe(4);
});

test('home page section list test', async() => {
    let actualHomePageSectionNames = await homePage.getHomePageSectionNames();
    console.log(`Sections in home page are ${actualHomePageSectionNames}`);
    expect(actualHomePageSectionNames).toHaveLength(4); //same as above count test
    expect(actualHomePageSectionNames).toEqual([
        'My Account',
        'My Orders',
        'My Affiliate Account',
        'Newsletter'
    ])
});