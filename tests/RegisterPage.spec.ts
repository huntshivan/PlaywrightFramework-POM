import {test, expect} from "../src/fixtures/pageFixtures"
import { RegisterPage } from "../src/pages/RegisterPage";
import { CsvHelper } from "../src/utils/CsvHelper";

test.beforeEach(async({loginPage}) => {
    await loginPage.goToLoginPage();
    await loginPage.doRegister();
})

test('register page title test', async({registerPage}) => {
    let actualRegisterPageTitle = await registerPage.registerPageTitle();
    expect(actualRegisterPageTitle).toBe('Register Account');
});

test('register page url test', async({registerPage}) => {
    let actualRegisterPageURL = registerPage.registerPageURL();
    expect(actualRegisterPageURL).toContain('route=account/register');
});

test('register account header test', async({registerPage}) => {
    expect(registerPage.isRegisterAccountHeaderDisplayed()).toBeTruthy();
})

//1. Runs the test in sequential mode for the data in the loop i.e. only 1 browser launched to run this test for all the data
//   Report will show as 1 test instead of count of test data 
test('invalid registeration test using fixture', async({registerPage, registerTestData}) => {
    for (let row of registerTestData) {
        await registerPage.doRegistration(row.firstname, row.lastname, row.email, row.telephone, row.password);
        expect(await registerPage.isRegistrationErrorMessageDisplayed()).toBeTruthy();
    }
});

//2. Without fxture, run test parrallely for all the data, read csv file directly and loop the test method row wise...
//   Report will show 1 test for each test data in the csv file

let registerTestData = CsvHelper.readCSV('src/testdata/registerdata.csv');
for (let row of registerTestData) {
    test(`Invalid register test - ${row.firstname} - ${row.lastname}`, async( {registerPage} ) => {
        await registerPage.doRegistration(row.firstname, row.lastname, row.email, row.telephone, row.password);
        expect(await registerPage.isRegistrationErrorMessageDisplayed()).toBeTruthy();
    });
}

