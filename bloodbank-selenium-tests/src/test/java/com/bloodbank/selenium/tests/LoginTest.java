package com.bloodbank.selenium.tests;

import com.bloodbank.selenium.base.BaseTest;
import com.bloodbank.selenium.pages.LoginPage;
import com.bloodbank.selenium.pages.UserDashboardPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * LoginTest — Tests for the Login page.
 *
 * HOW TESTS WORK:
 * ----------------
 * Each method annotated with @Test is ONE test case.
 * TestNG runs each @Test method and marks it as PASS or FAIL.
 *
 * Assert.assertTrue(condition)  → passes if condition is true, fails otherwise
 * Assert.assertEquals(a, b)     → passes if a equals b
 * Assert.assertFalse(condition) → passes if condition is false
 *
 * DEMO CREDENTIALS (from the login page):
 *   Admin  → admin@bloodbank.com  / Admin@123
 *   User   → (register a user first, or use test data from the DB)
 */
public class LoginTest extends BaseTest {

    // Page Object — we use this to interact with the login page
    private LoginPage loginPage;
    private UserDashboardPage dashboardPage;

    /**
     * @BeforeMethod runs before EACH @Test method.
     * We navigate to /login before every test so each test starts fresh.
     */
    @BeforeMethod
    public void openLoginPage() {
        navigateTo("/login");
        loginPage = new LoginPage(driver);
        dashboardPage = new UserDashboardPage(driver);
    }

    // =========================================================================
    // TEST 1 — Verify the login page loads correctly
    // =========================================================================
    @Test(description = "Verify login page is displayed with correct heading")
    public void tc01_loginPageLoads() {
        System.out.println("TC01: Checking login page loads...");

        // Assert that the login page is showing "Welcome Back"
        Assert.assertTrue(loginPage.isDisplayed(),
                "FAIL: Login page did not display 'Welcome Back' heading");

        // Assert the URL contains /login
        Assert.assertTrue(loginPage.getCurrentUrl().contains("/login"),
                "FAIL: URL does not contain /login");

        System.out.println("TC01 PASSED: Login page loaded correctly.");
    }

    // =========================================================================
    // TEST 2 — Login with valid ADMIN credentials
    // =========================================================================
    @Test(description = "Login with valid admin credentials should redirect to dashboard")
    public void tc02_validAdminLogin() {
        System.out.println("TC02: Testing valid admin login...");

        // Action: fill in the form and submit
        loginPage.loginWith("admin@bloodbank.com", "Admin@123");

        // Wait for redirect — after successful login Angular redirects to /admin/dashboard or /user
        dashboardPage.waitForDashboard();

        // Assert: URL should no longer be /login
        String currentUrl = loginPage.getCurrentUrl();
        Assert.assertFalse(currentUrl.contains("/login"),
                "FAIL: After valid login, should NOT be on /login. Current URL: " + currentUrl);

        System.out.println("TC02 PASSED: Redirected to: " + currentUrl);
    }

    // =========================================================================
    // TEST 3 — Login with wrong password
    // =========================================================================
    @Test(description = "Login with wrong password should show error message")
    public void tc03_invalidPasswordLogin() {
        System.out.println("TC03: Testing login with wrong password...");

        // Action: use correct email but wrong password
        loginPage.loginWith("admin@bloodbank.com", "wrongpassword");

        // Assert: a snackbar (toast) error message appears
        String message = loginPage.getSnackbarMessage();
        System.out.println("Error message received: " + message);

        Assert.assertFalse(message.isEmpty(),
                "FAIL: Expected an error snackbar message but got nothing");

        // Also assert we're still on the login page (no redirect)
        Assert.assertTrue(loginPage.getCurrentUrl().contains("/login"),
                "FAIL: Should stay on /login after failed login");

        System.out.println("TC03 PASSED: Error shown for invalid credentials.");
    }

    // =========================================================================
    // TEST 4 — Login with empty fields
    // =========================================================================
    @Test(description = "Login with empty fields should keep submit button disabled or show validation")
    public void tc04_emptyFieldsLogin() {
        System.out.println("TC04: Testing login with empty fields...");

        // Don't type anything — just click submit
        loginPage.clickSubmit();

        // Assert: still on the login page (form validation prevented submission)
        sleep(1); // small pause to let Angular show validation messages
        Assert.assertTrue(loginPage.getCurrentUrl().contains("/login"),
                "FAIL: Should stay on /login when fields are empty");

        System.out.println("TC04 PASSED: Stayed on login page with empty fields.");
    }

    // =========================================================================
    // TEST 5 — Click "Register" link navigates to register page
    // =========================================================================
    @Test(description = "Clicking Register link should navigate to /register")
    public void tc05_navigateToRegister() {
        System.out.println("TC05: Testing Register link navigation...");

        // Action: click the register link
        loginPage.clickRegisterLink();

        // Wait a moment for navigation
        sleep(2);

        // Assert: URL now contains /register
        Assert.assertTrue(loginPage.getCurrentUrl().contains("/register"),
                "FAIL: Expected URL to contain /register. Got: " + loginPage.getCurrentUrl());

        System.out.println("TC05 PASSED: Navigated to register page.");
    }

    // =========================================================================
    // TEST 6 — Login with invalid email format
    // =========================================================================
    @Test(description = "Login with invalid email format should show email validation error")
    public void tc06_invalidEmailFormat() {
        System.out.println("TC06: Testing invalid email format...");

        // Type an invalid email (no @ symbol)
        loginPage.enterEmail("notanemail");
        loginPage.enterPassword("somepassword");
        loginPage.clickSubmit();

        sleep(1);

        // Assert: stays on login page (Angular form validation rejects it)
        Assert.assertTrue(loginPage.getCurrentUrl().contains("/login"),
                "FAIL: Should stay on login page with invalid email format");

        System.out.println("TC06 PASSED: Form validation rejected invalid email.");
    }
}
