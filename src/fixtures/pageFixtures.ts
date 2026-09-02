//fixture: supply data/objects to test methods using 'use'inbuilt callback function

import { test as baseTest} from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { HomePage } from "../pages/HomePage"
import { CsvHelper } from "../utils/CsvHelper";
import { RegisterPage } from "../pages/RegisterPage";

//define types for page fixtures
type pageFixtures = {
    loginPage: LoginPage,
    homePage: HomePage,
    registerPage: RegisterPage,
    loginTestData: Record<string,string>[],
    registerTestData: Record<string,string>[],
};

//extent playwright baseTest
//use is inbuilt callback function
export let test = baseTest.extend<pageFixtures>({
    loginPage: async({page}, use) => {
        let loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async({page}, use) => {
        let homePage = new HomePage(page);
        await use(homePage);
    },
    registerPage: async({page}, use) => {
        let registerPage = new RegisterPage(page);
        await use(registerPage);
    },
    loginTestData: async({ }, use) => {
        let loginTestData = CsvHelper.readCSV('src/testdata/logindata.csv');
        await use(loginTestData);
    },
    registerTestData: async({ }, use) => {
        let registerTestData = CsvHelper.readCSV('src/testdata/registerdata.csv');
        await use(registerTestData);
    }

})

export { expect } from "@playwright/test";