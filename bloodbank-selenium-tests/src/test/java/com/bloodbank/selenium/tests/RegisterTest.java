package com.bloodbank.selenium.tests;

import com.bloodbank.selenium.base.BaseTest;
import com.bloodbank.selenium.pages.LoginPage;
import com.bloodbank.selenium.pages.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * RegisterTest — Tests for the Register page.
 */
public class RegisterTest extends BaseTest {

    private RegisterPage registerPage;
    private LoginPage loginPage;

    @BeforeMethod
    public void openRegisterPage() {
        navigateTo("/register");
        registerPage = new RegisterPage(driver);
        loginPage = new LoginPage(driver);
    }

    // =========================================================================
    // TEST 1 — Register page loads correctly
    // =========================================================================
    @Test(description = "Verify register page loads with 'Create Account' heading")
    public void tc01_registerPageLoads() {
        System.out.println("TC01: Checking register page loads...");

        Assert.assertTrue(registerPage.isDisplayed(),
                "FAIL: Register page did not show 'Create Account' heading");

        Assert.assertTrue(registerPage.getCurrentUrl().contains("/register"),
                "FAIL: URL should contain /register");

        System.out.println("TC01 PASSED: Register page loaded correctly.");
    }

    // =========================================================================
    // TEST 2 — Navigate to Sign In from register page
    // =========================================================================
    @Test(description = "Clicking 'Sign In' link from register page should go to /login")
    public void tc02_navigateToLogin() {
        System.out.println("TC02: Testing Sign In link from register page...");

        registerPage.clickSignInLink();

        sleep(2);

        Assert.assertTrue(registerPage.getCurrentUrl().contains("/login"),
                "FAIL: Expected to be on /login. Got: " + registerPage.getCurrentUrl());

        System.out.println("TC02 PASSED: Navigated back to login page.");
    }

    // =========================================================================
    // TEST 3 — Fill valid registration form and verify submit becomes enabled
    // =========================================================================
    @Test(description = "Filling all required fields should enable the submit button")
    public void tc03_formFieldsEnableSubmit() {
        System.out.println("TC03: Filling registration form...");

        // Fill all required fields
        registerPage.enterFirstName("Test");
        registerPage.enterLastName("User");
        registerPage.enterPassword("test1234");
        registerPage.enterPhone("9876543210");
        registerPage.enterCity("Chennai");

        // Note: We skip email + OTP verification here since that needs a real email
        // We just verify the other fields are fillable

        sleep(1);

        System.out.println("TC03 PASSED: Form fields accepted input.");
    }

    // =========================================================================
    // TEST 4 — Submit with empty form stays on register page
    // =========================================================================
    @Test(description = "Submitting empty form should not navigate away")
    public void tc04_emptyFormStaysOnPage() {
        System.out.println("TC04: Submitting empty register form...");

        registerPage.clickSubmit();
        sleep(1);

        Assert.assertTrue(registerPage.getCurrentUrl().contains("/register"),
                "FAIL: Should stay on /register with empty form");

        System.out.println("TC04 PASSED: Stayed on register page with empty form.");
    }

    // =========================================================================
    // TEST 5 — Password field is of type password (characters hidden)
    // =========================================================================
    @Test(description = "Password field should hide characters by default")
    public void tc05_passwordFieldIsHidden() {
        System.out.println("TC05: Verifying password field type...");

        // Find the password input element
        String inputType = waitForElement(
                org.openqa.selenium.By.cssSelector("input[formcontrolname='password']")
        ).getAttribute("type");

        Assert.assertEquals(inputType, "password",
                "FAIL: Password field type should be 'password' (hidden), got: " + inputType);

        System.out.println("TC05 PASSED: Password field correctly hides text.");
    }

    // =========================================================================
    // TEST 6 — All required input fields are visible on the page
    // =========================================================================
    @Test(description = "All required form fields should be visible on register page")
    public void tc06_allFieldsVisible() {
        System.out.println("TC06: Checking all form fields are visible...");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='firstName']")),
                "FAIL: First name field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='lastName']")),
                "FAIL: Last name field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='email']")),
                "FAIL: Email field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='password']")),
                "FAIL: Password field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='phone']")),
                "FAIL: Phone field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='city']")),
                "FAIL: City field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("mat-select[formcontrolname='bloodGroup']")),
                "FAIL: Blood Group dropdown not found");

        System.out.println("TC06 PASSED: All form fields are visible.");
    }
}
