package com.bloodbank.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * RegisterPage — Page Object for the Registration screen.
 */
public class RegisterPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // =========================================================================
    // LOCATORS
    // =========================================================================

    private final By firstNameInput   = By.cssSelector("input[formcontrolname='firstName']");
    private final By lastNameInput    = By.cssSelector("input[formcontrolname='lastName']");
    private final By emailInput       = By.cssSelector("input[formcontrolname='email']");
    private final By passwordInput    = By.cssSelector("input[formcontrolname='password']");
    private final By phoneInput       = By.cssSelector("input[formcontrolname='phone']");
    private final By cityInput        = By.cssSelector("input[formcontrolname='city']");

    // mat-select for blood group (Angular Material dropdown — NOT a regular <select>)
    private final By bloodGroupSelect = By.cssSelector("mat-select[formcontrolname='bloodGroup']");

    // "Send OTP" button inside the email field (matSuffix button)
    private final By sendOtpButton    = By.xpath("//button[contains(text(),'Send OTP')]");

    // Submit button "Create Account"
    private final By submitButton     = By.cssSelector("button.submit-btn");

    // Sign In link at the bottom
    private final By signInLink       = By.cssSelector("a[routerlink='/login']");

    // Snackbar message (success or error)
    private final By snackbarMessage  = By.cssSelector(".mat-mdc-snack-bar-label");

    // "Create Account" heading — to confirm the page loaded
    private final By pageHeading      = By.cssSelector("h2");

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================
    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // =========================================================================
    // ACTIONS
    // =========================================================================

    public void enterFirstName(String firstName) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(firstNameInput));
        field.clear();
        field.sendKeys(firstName);
    }

    public void enterLastName(String lastName) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(lastNameInput));
        field.clear();
        field.sendKeys(lastName);
    }

    public void enterEmail(String email) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(emailInput));
        field.clear();
        field.sendKeys(email);
    }

    public void enterPassword(String password) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInput));
        field.clear();
        field.sendKeys(password);
    }

    public void enterPhone(String phone) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(phoneInput));
        field.clear();
        field.sendKeys(phone);
    }

    public void enterCity(String city) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(cityInput));
        field.clear();
        field.sendKeys(city);
    }

    /**
     * Select a blood group from the Angular Material dropdown (mat-select).
     *
     * HOW mat-select WORKS in Selenium:
     * 1. Click the dropdown → Angular opens a floating panel with options
     * 2. Wait for the options to appear in the DOM
     * 3. Click the matching option
     *
     * Regular <select> doesn't work here — you MUST click the mat-select element
     * and then click the mat-option. The options live in an overlay outside the form.
     */
    public void selectBloodGroup(String bloodGroup) {
        // Step 1: Click to open the dropdown
        wait.until(ExpectedConditions.elementToBeClickable(bloodGroupSelect)).click();

        // Step 2: Build a locator for the specific option
        // mat-option elements appear as a floating overlay anywhere in the DOM
        By optionLocator = By.xpath("//mat-option[.//span[text()='" + bloodGroup + "']]");

        // Step 3: Wait for options to appear, then click the right one
        wait.until(ExpectedConditions.visibilityOfElementLocated(optionLocator)).click();
    }

    public void clickSendOtp() {
        wait.until(ExpectedConditions.elementToBeClickable(sendOtpButton)).click();
    }

    public void clickSubmit() {
        wait.until(ExpectedConditions.elementToBeClickable(submitButton)).click();
    }

    public void clickSignInLink() {
        wait.until(ExpectedConditions.elementToBeClickable(signInLink)).click();
    }

    // =========================================================================
    // CHECKS
    // =========================================================================

    public boolean isDisplayed() {
        try {
            WebElement heading = wait.until(ExpectedConditions.visibilityOfElementLocated(pageHeading));
            return heading.getText().contains("Create Account");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isSubmitButtonEnabled() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(submitButton)).isEnabled();
    }

    public String getSnackbarMessage() {
        try {
            WebElement snack = wait.until(ExpectedConditions.visibilityOfElementLocated(snackbarMessage));
            return snack.getText();
        } catch (Exception e) {
            return "";
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
