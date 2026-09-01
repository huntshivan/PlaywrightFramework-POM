
import {test, expect} from '../src/fixtures/pageFixtures'


test.beforeEach(async ({loginPage}) => {
    await loginPage.goToLoginPage();
});

test('login page title test', async({loginPage}) => {
    let actualLoginPageTitle: string = await loginPage.loginPageTitle();
    console.log(`Login Page Title: ${actualLoginPageTitle}`);
    expect(actualLoginPageTitle).toBe('Account Login');
});

test('login page url test', async({loginPage}) => {
    let actualLoginPageURL = loginPage.loginPageURL();
    console.log(`Login Page URL: ${actualLoginPageURL}`);
    expect(actualLoginPageURL).toContain('route=account/login');
});

test('Forgotten Password link displayed test', async({loginPage}) => {
    expect(loginPage.isForgottenPasswordLinkVisible).toBeTruthy();
});

test('user successful login test', async({loginPage, homePage}) => {
    await loginPage.doLogin('shivansharma07@gmail.com', 'Selenium@12345');
    expect(await homePage.isLogoutLinkVisible()).toBeTruthy();
    expect(await homePage.getHomePageTitle()).toBe('My Account');
})