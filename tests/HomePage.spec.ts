import {test, expect} from '../src/fixtures/pageFixtures'

test.beforeEach(async({loginPage}) => {
    await loginPage.goToLoginPage();
    await loginPage.doLogin('shivansharma07@gmail.com', 'Selenium@12345');
})

test('home page title test', async({homePage}) => {
    let actualHomePageTitle = await homePage.getHomePageTitle();
    console.log(`Home Page title is ${actualHomePageTitle}`);
    expect(actualHomePageTitle).toBe('My Account');
});

test('home page url test', async({homePage}) => {
    let actualHomePageURL = homePage.getHomePageURL();
    console.log(`Home Page url is ${actualHomePageURL}`);
    expect(actualHomePageURL).toContain('route=account/account');
});

test('logout link displayed test', async({homePage}) => {
    expect(homePage.isLogoutLinkVisible).toBeTruthy();
});

test('home page account header test', async({homePage}) => {
    let actualHomePageLinkHeader = await homePage.gethomePageLinkHeader();
    console.log(`Home Page header link is ${actualHomePageLinkHeader}`);
    expect(actualHomePageLinkHeader).toBe('Account');
});

test('home page section count test', async({homePage}) => {
    let actualHomePageSectionCount = await homePage.getHomePageSectionCount();
    console.log(`Total number of sections in home page is ${actualHomePageSectionCount}`);
    expect(actualHomePageSectionCount).toBe(4);
});

test('home page section list test', async({homePage}) => {
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