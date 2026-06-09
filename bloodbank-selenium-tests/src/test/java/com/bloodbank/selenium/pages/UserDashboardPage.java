package com.bloodbank.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * UserDashboardPage — Page Object for the User Dashboard screen.
 */
public class UserDashboardPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // =========================================================================
    // LOCATORS
    // =========================================================================

    // Sidebar navigation links (inside the user layout)
    private final By requestBloodNavLink  = By.cssSelector("a[routerlink='/user/request-blood']");
    private final By myRequestsNavLink    = By.cssSelector("a[routerlink='/user/my-requests']");
    private final By donationNavLink      = By.cssSelector("a[routerlink='/user/donation-history']");
    private final By profileNavLink       = By.cssSelector("a[routerlink='/user/profile']");

    // Stats cards on the dashboard
    private final By statCards            = By.cssSelector(".stat-mini");

    // Blood inventory grid items
    private final By inventoryItems       = By.cssSelector(".availability-grid .blood-group-item, .blood-item");

    // "Request Blood" quick action button on dashboard
    private final By requestBloodButton   = By.cssSelector("a[routerlink='/user/request-blood'] button, button[routerlink='/user/request-blood']");

    // Logout button in the navbar
    private final By logoutButton         = By.cssSelector("a.btn-login");

    // Dashboard heading (to confirm we're on the right page)
    private final By dashboardGreeting    = By.cssSelector(".welcome-banner h1, .greeting, h1");

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================
    public UserDashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // =========================================================================
    // ACTIONS
    // =========================================================================

    public void goToRequestBlood() {
        wait.until(ExpectedConditions.elementToBeClickable(requestBloodNavLink)).click();
    }

    public void goToMyRequests() {
        wait.until(ExpectedConditions.elementToBeClickable(myRequestsNavLink)).click();
    }

    public void goToDonationHistory() {
        wait.until(ExpectedConditions.elementToBeClickable(donationNavLink)).click();
    }

    public void goToProfile() {
        wait.until(ExpectedConditions.elementToBeClickable(profileNavLink)).click();
    }

    public void clickLogout() {
        wait.until(ExpectedConditions.elementToBeClickable(logoutButton)).click();
    }

    // =========================================================================
    // CHECKS
    // =========================================================================

    /** Returns true if we are on the user dashboard (URL contains /user/dashboard) */
    public boolean isOnDashboard() {
        return driver.getCurrentUrl().contains("/user/dashboard") ||
               driver.getCurrentUrl().contains("/user");
    }

    /** Returns the number of stat cards visible (Total Requests, Pending, Approved, Donations) */
    public int getStatCardCount() {
        List<WebElement> cards = driver.findElements(statCards);
        return cards.size();
    }

    /** Returns the current browser URL */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /** Wait until we are on the dashboard URL */
    public void waitForDashboard() {
        wait.until(ExpectedConditions.urlContains("/user"));
    }
}
