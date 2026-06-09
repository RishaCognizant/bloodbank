package com.bloodbank.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * LoginPage — Page Object for the Login screen.
 *
 * WHAT IS PAGE OBJECT MODEL (POM)?
 * ---------------------------------
 * Instead of writing driver.findElement(By.cssSelector("...")) everywhere in your tests,
 * you create ONE class per page that stores all the locators and actions for that page.
 *
 * ANALOGY: Think of LoginPage like a TV remote control.
 * The remote (LoginPage) knows where all the buttons (elements) are.
 * You just press "volume up" (call a method) — you don't need to know the exact location of the button.
 *
 * HOW LOCATORS WORK (CSS Selectors used here):
 * -----------------------------------------------
 * In our Angular app, form fields use Angular's formControlName attribute.
 * When Angular renders the page, it puts formcontrolname="email" on the <input> element.
 *
 * CSS Selector syntax:
 *   input[formcontrolname="email"]  →  find an <input> that has attribute formcontrolname="email"
 *   button.submit-btn               →  find a <button> with class "submit-btn"
 *   .mat-mdc-snack-bar-label        →  find any element with class "mat-mdc-snack-bar-label"
 */
public class LoginPage {

    // The browser controller — passed in from the test
    private final WebDriver driver;
    private final WebDriverWait wait;

    // =========================================================================
    // LOCATORS — Where each element is on the page
    // =========================================================================
    // These are the "addresses" of elements on the login page

    // Email input field → <input formcontrolname="email">
    private final By emailInput = By.cssSelector("input[formcontrolname='email']");

    // Password input field → <input formcontrolname="password">
    private final By passwordInput = By.cssSelector("input[formcontrolname='password']");

    // Submit button → <button class="full-width submit-btn">
    private final By submitButton = By.cssSelector("button.submit-btn");

    // The register link at the bottom → <a routerLink="/register">Register</a>
    private final By registerLink = By.cssSelector("a[routerlink='/register']");

    // Snackbar (toast notification) that shows error messages like "Invalid email or password"
    private final By snackbarMessage = By.cssSelector(".mat-mdc-snack-bar-label");

    // The "Welcome Back" heading — we use this to confirm the page has loaded
    private final By pageHeading = By.cssSelector("h2");

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // =========================================================================
    // ACTIONS — What a user can DO on this page
    // =========================================================================

    /** Type into the email field */
    public void enterEmail(String email) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(emailInput));
        field.clear();
        field.sendKeys(email);
    }

    /** Type into the password field */
    public void enterPassword(String password) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInput));
        field.clear();
        field.sendKeys(password);
    }

    /** Click the Sign In button */
    public void clickSubmit() {
        wait.until(ExpectedConditions.elementToBeClickable(submitButton)).click();
    }

    /** Click the Register link to go to the registration page */
    public void clickRegisterLink() {
        wait.until(ExpectedConditions.elementToBeClickable(registerLink)).click();
    }

    /**
     * ONE-SHOT login method — fills email, password and submits.
     * Most tests will call this single method instead of three separate ones.
     */
    public void loginWith(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickSubmit();
    }

    // =========================================================================
    // CHECKS — What we can verify on this page
    // =========================================================================

    /** Check if the login page is currently displayed */
    public boolean isDisplayed() {
        try {
            WebElement heading = wait.until(ExpectedConditions.visibilityOfElementLocated(pageHeading));
            return heading.getText().contains("Welcome Back");
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the error snackbar message text.
     * When login fails, Angular Material shows a "snackbar" (toast notification) at the bottom.
     */
    public String getSnackbarMessage() {
        try {
            WebElement snack = wait.until(ExpectedConditions.visibilityOfElementLocated(snackbarMessage));
            return snack.getText();
        } catch (Exception e) {
            return "";
        }
    }

    /** Get the current URL of the browser */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
