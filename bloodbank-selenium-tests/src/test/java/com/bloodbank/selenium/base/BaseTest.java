package com.bloodbank.selenium.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import java.time.Duration;

/**
 * BaseTest — The parent class that every test class extends.
 *
 * ANALOGY: Think of this like a "kitchen setup" class.
 * Before cooking (testing), you set up your tools (browser).
 * After cooking (testing), you clean up (close the browser).
 *
 * Every test class extends BaseTest, so they all get:
 *  - A ready-to-use browser (driver)
 *  - A helper that waits for things to appear on screen (wait)
 *  - Common helper methods
 */
public class BaseTest {

    // --- CONSTANTS ---
    // The URL where your Angular frontend runs
    protected static final String BASE_URL = "http://localhost:4200";

    // How many seconds to wait for elements before giving up
    protected static final int TIMEOUT_SECONDS = 10;

    // --- FIELDS ---
    // 'driver' is the object that controls the Chrome browser
    protected WebDriver driver;

    // 'wait' is a smart waiter — it keeps checking until something appears (up to TIMEOUT_SECONDS)
    // This is needed because Angular pages load content dynamically (not instant)
    protected WebDriverWait wait;

    // =========================================================================
    // SETUP — runs ONCE before all test methods in the class
    // =========================================================================
    @BeforeClass
    public void setUp() {
        // Step 1: Tell WebDriverManager to automatically download the correct ChromeDriver
        // Without this you'd have to manually download chromedriver.exe and configure paths
        WebDriverManager.chromedriver().setup();

        // Step 2: Configure Chrome browser options
        ChromeOptions options = new ChromeOptions();
        // Uncomment the line below to run Chrome in the background (no visible window)
        // options.addArguments("--headless");
        options.addArguments("--start-maximized");     // open browser full screen
        options.addArguments("--disable-notifications"); // no pop-up notifications
        options.addArguments("--remote-allow-origins=*");

        // Step 3: Create the browser instance
        driver = new ChromeDriver(options);

        // Step 4: Set up WebDriverWait — waits up to 10 seconds for elements to appear
        wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));

        // Step 5: Set an implicit wait — driver will retry for 3s before throwing "not found"
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));

        System.out.println("Browser started successfully.");
    }

    // =========================================================================
    // TEARDOWN — runs ONCE after all test methods in the class finish
    // =========================================================================
    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit(); // closes the browser and ends the WebDriver session
            System.out.println("Browser closed.");
        }
    }

    // =========================================================================
    // HELPER METHODS — reusable utilities used in all tests
    // =========================================================================

    /**
     * Navigate to a specific page.
     * Example: navigateTo("/login") → opens http://localhost:4200/login
     */
    protected void navigateTo(String path) {
        driver.get(BASE_URL + path);
    }

    /**
     * Wait for an element to appear on screen, then return it.
     * Use this instead of driver.findElement() to avoid "element not found" errors
     * on slow-loading Angular pages.
     */
    protected WebElement waitForElement(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Wait for an element to be clickable (visible AND enabled).
     */
    protected WebElement waitForClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    /**
     * Type text into an input field.
     * Clears any existing text first, then types the new value.
     */
    protected void typeInto(By locator, String text) {
        WebElement element = waitForElement(locator);
        element.clear();
        element.sendKeys(text);
    }

    /**
     * Click on an element.
     */
    protected void clickOn(By locator) {
        waitForClickable(locator).click();
    }

    /**
     * Get the text content of an element.
     */
    protected String getTextOf(By locator) {
        return waitForElement(locator).getText();
    }

    /**
     * Check if an element exists on the page right now (no waiting).
     */
    protected boolean isElementPresent(By locator) {
        return !driver.findElements(locator).isEmpty();
    }

    /**
     * Pause the test for a given number of seconds.
     * NOTE: Only use this for debugging. Prefer waitForElement() in real tests.
     */
    protected void sleep(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
