package com.bloodbank.selenium.tests;

import com.bloodbank.selenium.base.BaseTest;
import com.bloodbank.selenium.pages.LoginPage;
import com.bloodbank.selenium.pages.UserDashboardPage;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

/**
 * UserDashboardTest — Tests that require a logged-in user.
 *
 * IMPORTANT: We log in ONCE in @BeforeClass, then run all dashboard tests
 * with that active session. This is more efficient than logging in before each test.
 */
public class UserDashboardTest extends BaseTest {

    private UserDashboardPage dashboardPage;
    private LoginPage loginPage;

    /**
     * @BeforeClass — runs once before ALL tests in this class.
     * We log in here so all test methods start from a logged-in state.
     */
    @BeforeClass
    @Override
    public void setUp() {
        // Call parent setUp() to launch the browser
        super.setUp();

        // Now perform login
        navigateTo("/login");
        loginPage = new LoginPage(driver);
        dashboardPage = new UserDashboardPage(driver);

        // Log in with admin credentials (admin can also see user features)
        loginPage.loginWith("admin@bloodbank.com", "Admin@123");

        // Wait until we're redirected away from /login
        dashboardPage.waitForDashboard();

        // Navigate to user dashboard directly
        navigateTo("/user/dashboard");
        sleep(2); // let Angular finish rendering

        System.out.println("Logged in. Starting dashboard tests...");
    }

    // =========================================================================
    // TEST 1 — User is on the dashboard after login
    // =========================================================================
    @Test(description = "After login, user should be on the dashboard page")
    public void tc01_dashboardLoads() {
        System.out.println("TC01: Checking dashboard URL...");

        String url = dashboardPage.getCurrentUrl();
        Assert.assertTrue(url.contains("/user"),
                "FAIL: Expected /user in URL. Got: " + url);

        System.out.println("TC01 PASSED: On dashboard. URL: " + url);
    }

    // =========================================================================
    // TEST 2 — Navigate to "Request Blood" page
    // =========================================================================
    @Test(description = "Clicking Request Blood in sidebar should go to /user/request-blood",
          dependsOnMethods = "tc01_dashboardLoads")
    public void tc02_navigateToRequestBlood() {
        System.out.println("TC02: Navigating to Request Blood page...");

        // Make sure we're on dashboard first
        navigateTo("/user/dashboard");
        sleep(2);

        // Click the sidebar link
        dashboardPage.goToRequestBlood();
        sleep(2);

        Assert.assertTrue(dashboardPage.getCurrentUrl().contains("/user/request-blood"),
                "FAIL: Expected /user/request-blood. Got: " + dashboardPage.getCurrentUrl());

        System.out.println("TC02 PASSED: On Request Blood page.");
    }

    // =========================================================================
    // TEST 3 — Navigate to "My Requests" page
    // =========================================================================
    @Test(description = "Clicking My Requests in sidebar should go to /user/my-requests",
          dependsOnMethods = "tc01_dashboardLoads")
    public void tc03_navigateToMyRequests() {
        System.out.println("TC03: Navigating to My Requests page...");

        navigateTo("/user/dashboard");
        sleep(2);

        dashboardPage.goToMyRequests();
        sleep(2);

        Assert.assertTrue(dashboardPage.getCurrentUrl().contains("/user/my-requests"),
                "FAIL: Expected /user/my-requests. Got: " + dashboardPage.getCurrentUrl());

        System.out.println("TC03 PASSED: On My Requests page.");
    }

    // =========================================================================
    // TEST 4 — Request Blood form has required fields
    // =========================================================================
    @Test(description = "Request Blood form should show all required fields")
    public void tc04_requestBloodFormFields() {
        System.out.println("TC04: Checking Request Blood form fields...");

        navigateTo("/user/request-blood");
        sleep(2);

        // Check that the key fields are present
        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='patientName']")),
                "FAIL: Patient Name field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='hospital']")),
                "FAIL: Hospital field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("input[formcontrolname='units']")),
                "FAIL: Units field not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("mat-select[formcontrolname='bloodGroup']")),
                "FAIL: Blood Group dropdown not found");

        Assert.assertTrue(
                isElementPresent(org.openqa.selenium.By.cssSelector("mat-select[formcontrolname='severity']")),
                "FAIL: Severity dropdown not found");

        System.out.println("TC04 PASSED: All request blood form fields are present.");
    }

    // =========================================================================
    // TEST 5 — Logout redirects to home or login page
    // =========================================================================
    @Test(description = "Clicking Logout should redirect away from dashboard",
          dependsOnMethods = "tc01_dashboardLoads")
    public void tc05_logoutRedirects() {
        System.out.println("TC05: Testing logout...");

        navigateTo("/user/dashboard");
        sleep(2);

        // Click the Logout button in the navbar
        dashboardPage.clickLogout();
        sleep(2);

        String urlAfterLogout = dashboardPage.getCurrentUrl();
        System.out.println("URL after logout: " + urlAfterLogout);

        // After logout, user should NOT be on /user/dashboard
        Assert.assertFalse(urlAfterLogout.contains("/user/dashboard"),
                "FAIL: Should not be on /user/dashboard after logout");

        System.out.println("TC05 PASSED: Logged out successfully. URL: " + urlAfterLogout);
    }
}
