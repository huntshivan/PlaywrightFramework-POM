
import {test, expect} from '../src/fixtures/pageFixtures'
import { LoginPage } from '../src/pages/LoginPage';
import { CsvHelper } from '../src/utils/CsvHelper';


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
    await loginPage.doLogin(process.env.EMAIL_ID!, process.env.PASSWORD!);
    expect(await homePage.isLogoutLinkVisible()).toBeTruthy();
    expect(await homePage.getHomePageTitle()).toBe('My Account');
});

//1. Runs the test in sequential mode for the data in the loop i.e. only 1 browser launched to run this test for all the data
//   Report will show as 1 test instead of count of test data 
test('login to app using wrong credentials with Data Driven test and using fixtures', async( {loginPage, loginTestData}) => {
    for (let row of loginTestData) {
        await loginPage.doLogin(row.emailid, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    }

});

//2. Without fxture, run test parrallely for all the data, read csv file directly and loop the test method row wise...
//   Report will show 1 test for each test data in the csv file

let loginTestData = CsvHelper.readCSV('src/testdata/logindata.csv');
for (let row of loginTestData) {
    test(`Invalid login test - ${row.emailid} - ${row.password}`, async( {loginPage} ) => {
        await loginPage.doLogin(row.emailid, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    });
}