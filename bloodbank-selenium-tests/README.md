# Blood Bank — Selenium Test Suite
### A Complete Beginner's Guide to Selenium WebDriver

---

## Table of Contents
1. [What is Selenium? (Simple Explanation)](#1-what-is-selenium-simple-explanation)
2. [Why Do We Write Tests?](#2-why-do-we-write-tests)
3. [Key Concepts You Must Know](#3-key-concepts-you-must-know)
4. [Project Structure Explained](#4-project-structure-explained)
5. [Prerequisites — What to Install](#5-prerequisites--what-to-install)
6. [How to Run the Tests](#6-how-to-run-the-tests)
7. [Understanding the Code — File by File](#7-understanding-the-code--file-by-file)
8. [Selenium Commands Cheat Sheet](#8-selenium-commands-cheat-sheet)
9. [How Locators Work (Finding Elements)](#9-how-locators-work-finding-elements)
10. [Common Errors and Fixes](#10-common-errors-and-fixes)

---

## 1. What is Selenium? (Simple Explanation)

**Imagine you hire a robot to test your website.**

That robot:
- Opens Chrome browser automatically
- Types in the email and password
- Clicks the Login button
- Checks if the dashboard appeared
- Reports back: "PASS" or "FAIL"

That robot is **Selenium WebDriver**.

Selenium is a **library** (a set of pre-written code) that lets you control a web browser using code (Java, Python, etc.).

```
Your Java Code  →  Selenium  →  ChromeDriver  →  Chrome Browser  →  Your Website
```

Instead of you manually testing every feature after every change, Selenium does it for you — automatically, every time.

---

## 2. Why Do We Write Tests?

**The problem:** Every time you add a new feature or fix a bug, you might accidentally break something else. Testing by hand takes too long.

**The solution:** Write tests once. Run them any time. They check everything automatically.

**Real example in this project:**
- You change the login button style → Selenium still finds it and clicks it
- Someone accidentally deletes a form field → Selenium test FAILS → you know immediately

---

## 3. Key Concepts You Must Know

### Concept 1: WebDriver
`WebDriver` is the main object that controls the browser. Think of it as the "hand" that clicks and types.

```java
WebDriver driver = new ChromeDriver();  // opens Chrome
driver.get("http://google.com");        // opens a URL
driver.quit();                          // closes Chrome
```

### Concept 2: Locators (Finding Elements)
To click a button or type in a field, Selenium must first FIND it on the page.

It finds elements using **locators** — like an address for each element.

The 3 most common locators:

| Locator Type | What it looks for | Example |
|---|---|---|
| `By.id("myId")` | Element with id="myId" | `<input id="myId">` |
| `By.cssSelector(".myClass")` | Element with class="myClass" | `<button class="myClass">` |
| `By.xpath("//h2")` | Any `<h2>` element on the page | `<h2>Welcome</h2>` |

### Concept 3: WebDriverWait (Smart Waiting)
Web pages don't load instantly — especially Angular apps. If Selenium looks for an element before it appears, it throws an error.

**Bad way:**
```java
Thread.sleep(5000);  // wait 5 seconds blindly (wasteful, fragile)
driver.findElement(...);
```

**Good way:**
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
// waits UP TO 10 seconds, but stops as soon as the element appears
```

### Concept 4: Page Object Model (POM)
**The problem without POM:**
```java
// In TestA.java
driver.findElement(By.cssSelector("input[formcontrolname='email']")).sendKeys("test@test.com");

// In TestB.java
driver.findElement(By.cssSelector("input[formcontrolname='email']")).sendKeys("test@test.com");

// If the selector changes, you must update EVERY test file!
```

**The solution — POM:**
```java
// In LoginPage.java — ONE place
private By emailInput = By.cssSelector("input[formcontrolname='email']");

public void enterEmail(String email) {
    driver.findElement(emailInput).sendKeys(email);
}
```

```java
// In TestA.java and TestB.java — just call the method
loginPage.enterEmail("test@test.com");
// If selector changes, only LoginPage.java needs updating!
```

**ANALOGY:** Page Object is like a TV remote. The remote knows where all the buttons are. You just press "volume up" — you don't need to know the exact button location on the remote.

### Concept 5: Assert (Verifying Results)
After doing an action (like clicking Login), you need to VERIFY the result.

```java
Assert.assertTrue(condition, "message if it fails");
// → passes if condition is TRUE

Assert.assertEquals(actual, expected, "message if it fails");
// → passes if actual equals expected

Assert.assertFalse(condition, "message if it fails");
// → passes if condition is FALSE
```

### Concept 6: TestNG Annotations
TestNG uses special annotations (words starting with `@`) to control test flow:

| Annotation | When it runs | Used for |
|---|---|---|
| `@BeforeClass` | Once before all tests in a class | Set up browser, log in |
| `@AfterClass` | Once after all tests in a class | Close browser |
| `@BeforeMethod` | Before each `@Test` method | Navigate to right page |
| `@AfterMethod` | After each `@Test` method | Take screenshot on failure |
| `@Test` | This IS the test | The actual test case |

---

## 4. Project Structure Explained

```
bloodbank-selenium-tests/
│
├── pom.xml                          ← Maven config (lists dependencies like Selenium)
├── testng.xml                       ← Which tests to run and in what order
│
└── src/
    └── test/
        └── java/
            └── com/bloodbank/selenium/
                │
                ├── base/
                │   └── BaseTest.java        ← Parent class: sets up/tears down browser
                │                              All test classes extend this
                │
                ├── pages/                   ← Page Object Model classes
                │   ├── LoginPage.java       ← Locators + actions for Login screen
                │   ├── RegisterPage.java    ← Locators + actions for Register screen
                │   └── UserDashboardPage.java ← Locators + actions for Dashboard
                │
                └── tests/                  ← Actual test cases
                    ├── LoginTest.java       ← 6 test cases for Login page
                    ├── RegisterTest.java    ← 6 test cases for Register page
                    └── UserDashboardTest.java ← 5 test cases for Dashboard
```

**How these connect:**

```
LoginTest extends BaseTest
    └── uses LoginPage (Page Object)
    └── uses UserDashboardPage (Page Object)

RegisterTest extends BaseTest
    └── uses RegisterPage (Page Object)

UserDashboardTest extends BaseTest
    └── uses LoginPage (to login first)
    └── uses UserDashboardPage
```

---

## 5. Prerequisites — What to Install

### Step 1: Java 17
Make sure Java 17 is installed.
```bash
java -version
# Should show: openjdk version "17.x.x"
```
Download from: https://adoptium.net/

### Step 2: Maven
Maven manages your project dependencies (downloads Selenium for you).
```bash
mvn -version
# Should show: Apache Maven 3.x.x
```
Download from: https://maven.apache.org/download.cgi

### Step 3: Google Chrome
The tests use Chrome browser. Make sure Chrome is installed.
```bash
# Check Chrome version in browser:
# Chrome → Menu (⋮) → Help → About Google Chrome
```

### Step 4: IntelliJ IDEA (Recommended IDE)
Open this project as a Maven project in IntelliJ.

### What you DON'T need to install manually
- ChromeDriver — WebDriverManager downloads it automatically!
- Selenium JAR files — Maven downloads them via `pom.xml`

---

## 6. How to Run the Tests

### Before running: Start the application
```bash
# Terminal 1: Start the backend (Spring Boot)
cd bloodbank-backend
mvn spring-boot:run

# Terminal 2: Start the frontend (Angular)
cd bloodbank-frontend
ng serve

# The frontend must be running at http://localhost:4200
# The backend must be running at http://localhost:7777
```

### Option A: Run from Terminal (Maven)
```bash
# Navigate into the selenium tests folder
cd bloodbank-selenium-tests

# Run ALL tests
mvn test

# Expected output:
# [INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
# [INFO] BUILD SUCCESS
```

### Option B: Run from IntelliJ IDEA
1. Open `bloodbank-selenium-tests` as a Maven project in IntelliJ
2. Right-click `testng.xml` → **Run 'testng.xml'**
3. Or right-click any `@Test` method → **Run**

### Option C: Run a single test class
```bash
mvn test -Dtest=LoginTest
mvn test -Dtest=RegisterTest
mvn test -Dtest=UserDashboardTest
```

### Option D: Run a single test method
```bash
mvn test -Dtest=LoginTest#tc02_validAdminLogin
```

### What happens when you run
1. Maven downloads dependencies (first time only, takes ~30 seconds)
2. WebDriverManager downloads the correct ChromeDriver
3. Chrome opens automatically
4. Tests run one by one — you'll see the browser clicking and typing
5. Chrome closes
6. Pass/Fail results shown in terminal

---

## 7. Understanding the Code — File by File

### BaseTest.java — The Foundation

```java
@BeforeClass
public void setUp() {
    WebDriverManager.chromedriver().setup();  // ← auto-downloads ChromeDriver
    driver = new ChromeDriver(options);        // ← opens Chrome
    wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // ← smart waiter
}

@AfterClass
public void tearDown() {
    driver.quit();  // ← closes Chrome
}
```

**Key helper methods in BaseTest:**

| Method | What it does | Example |
|---|---|---|
| `navigateTo("/login")` | Opens http://localhost:4200/login | Go to login page |
| `waitForElement(locator)` | Waits for element to appear, returns it | Find a text field |
| `waitForClickable(locator)` | Waits until element can be clicked | Find a button |
| `typeInto(locator, "text")` | Clears field and types text | Fill a form field |
| `clickOn(locator)` | Clicks an element | Click a button |
| `getTextOf(locator)` | Gets the text of an element | Read error message |
| `isElementPresent(locator)` | Returns true/false if element exists | Check if modal appeared |
| `sleep(2)` | Waits 2 seconds (use sparingly!) | Debugging pause |

---

### LoginPage.java — Page Object

```java
// LOCATORS — addresses of elements
private final By emailInput    = By.cssSelector("input[formcontrolname='email']");
private final By passwordInput = By.cssSelector("input[formcontrolname='password']");
private final By submitButton  = By.cssSelector("button.submit-btn");

// ACTIONS — what a user can do
public void enterEmail(String email) {
    // wait for field → clear it → type the email
}

public void loginWith(String email, String password) {
    enterEmail(email);
    enterPassword(password);
    clickSubmit();
}

// CHECKS — verify what's on the page
public boolean isDisplayed() { ... }
public String getSnackbarMessage() { ... }
```

---

### LoginTest.java — Test Cases

```
TC01 — Login page loads correctly
TC02 — Valid admin login → redirects to dashboard
TC03 — Wrong password → error snackbar appears
TC04 — Empty form → stays on login page
TC05 — Register link → goes to /register
TC06 — Invalid email format → form validation rejects it
```

Each test follows this pattern:
```
1. ARRANGE: Set up data (credentials, expected values)
2. ACT: Do the action (click login, type password)
3. ASSERT: Verify the result (check URL, check message)
```

---

### RegisterTest.java — Test Cases

```
TC01 — Register page loads with "Create Account" heading
TC02 — Sign In link navigates to /login
TC03 — Form fields accept user input
TC04 — Empty form submit stays on /register
TC05 — Password field hides characters (type="password")
TC06 — All form fields (firstName, lastName, email...) are visible
```

---

### UserDashboardTest.java — Test Cases

```
TC01 — After login, URL contains /user
TC02 — Sidebar Request Blood link → goes to /user/request-blood
TC03 — Sidebar My Requests link → goes to /user/my-requests
TC04 — Request Blood form has all required fields
TC05 — Logout button → navigates away from /user/dashboard
```

---

## 8. Selenium Commands Cheat Sheet

### Opening the Browser
```java
WebDriverManager.chromedriver().setup();  // auto-setup ChromeDriver
WebDriver driver = new ChromeDriver();    // open Chrome
driver.get("http://localhost:4200");      // navigate to URL
driver.quit();                            // close browser completely
driver.close();                           // close current tab only
```

### Finding Elements
```java
// These return ONE element
driver.findElement(By.id("myId"));
driver.findElement(By.cssSelector(".myClass"));
driver.findElement(By.xpath("//button[text()='Submit']"));
driver.findElement(By.tagName("h2"));
driver.findElement(By.linkText("Register"));

// This returns a LIST of elements
driver.findElements(By.cssSelector(".item"));
```

### Interacting with Elements
```java
WebElement el = driver.findElement(By.id("emailField"));

el.sendKeys("hello@example.com");  // type text
el.clear();                         // clear text
el.click();                         // click
el.submit();                        // submit a form

el.getText();                        // get the visible text
el.getAttribute("href");             // get an HTML attribute
el.isDisplayed();                    // is element visible?
el.isEnabled();                      // is element enabled (not disabled)?
```

### Waiting for Elements
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Wait until element is visible
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("myId")));

// Wait until element is clickable
wait.until(ExpectedConditions.elementToBeClickable(By.id("myBtn")));

// Wait until URL contains a string
wait.until(ExpectedConditions.urlContains("/dashboard"));

// Wait until text appears in element
wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("msg"), "Success"));
```

### Getting Browser Info
```java
driver.getCurrentUrl();    // current URL
driver.getTitle();         // page title (from <title> tag)
driver.getPageSource();    // full HTML of the page
```

---

## 9. How Locators Work (Finding Elements)

### CSS Selectors (Most Recommended)

```
input                            → all <input> elements
input[type="email"]              → <input type="email">
input[formcontrolname="email"]   → <input formcontrolname="email">
button.submit-btn                → <button class="submit-btn">
.full-width                      → any element with class="full-width"
#myId                            → element with id="myId"
a[routerlink="/login"]           → <a routerlink="/login">
mat-select[formcontrolname="bg"] → <mat-select formcontrolname="bg">
```

### XPath (More Powerful but Verbose)

```
//button                                 → all <button> elements anywhere
//button[text()='Sign In']               → <button>Sign In</button>
//button[contains(text(),'Sign')]        → button containing "Sign"
//mat-option[.//span[text()='O_POS']]    → mat-option containing span with 'O_POS'
//input[@type='email']                   → <input type="email">
```

### Why formcontrolname works in Angular
In your Angular template you write:
```html
<input matInput formControlName="email">
```
Angular renders this to the DOM as:
```html
<input _ngcontent-abc formcontrolname="email" ...>
```
Note: `formControlName` becomes lowercase `formcontrolname` in HTML — so use lowercase in CSS selectors.

### Angular Material Dropdowns (mat-select)
Regular `<select>` dropdowns can be controlled with `Select` class.
But Angular Material `<mat-select>` is different — you must:
```java
// 1. Click to OPEN the dropdown
driver.findElement(By.cssSelector("mat-select[formcontrolname='bloodGroup']")).click();

// 2. Wait for options to appear (they're in an overlay)
WebElement option = wait.until(ExpectedConditions.visibilityOfElementLocated(
    By.xpath("//mat-option[.//span[text()='O_POSITIVE']]")
));

// 3. Click the desired option
option.click();
```

---

## 10. Common Errors and Fixes

### Error: `NoSuchElementException`
**Meaning:** Selenium can't find the element on the page.

**Fixes:**
1. Check if the element exists in the browser (F12 → Inspector)
2. Add a wait: `wait.until(ExpectedConditions.visibilityOfElementLocated(...))`
3. Double-check your CSS selector — copy and test in browser console:
   ```javascript
   document.querySelector("input[formcontrolname='email']")
   ```

---

### Error: `ElementNotInteractableException`
**Meaning:** Element was found but can't be clicked or typed into.

**Fixes:**
1. The element might be hidden — wait for it to become visible
2. Another element might be covering it — scroll into view:
   ```java
   ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
   ```

---

### Error: `TimeoutException`
**Meaning:** The element didn't appear within the wait time (10 seconds).

**Fixes:**
1. Make sure the frontend is running (`ng serve` on port 4200)
2. Increase the timeout: `Duration.ofSeconds(20)`
3. Check if the page is slow to load

---

### Error: `StaleElementReferenceException`
**Meaning:** You found an element, then the page re-rendered (Angular often does this), and your reference is now stale.

**Fix:** Find the element again instead of storing it long-term:
```java
// BAD — element might become stale
WebElement btn = driver.findElement(locator);
sleep(2);  // page re-renders here
btn.click();  // StaleElementReferenceException!

// GOOD — find it fresh right before use
driver.findElement(locator).click();
```

---

### Error: `SessionNotCreatedException`
**Meaning:** ChromeDriver version doesn't match Chrome browser version.

**Fix:** WebDriverManager should handle this automatically. If not:
```java
WebDriverManager.chromedriver().browserVersion("120").setup();
```
Or update Chrome to the latest version.

---

### Tests Fail Because Angular Hasn't Loaded
**Symptoms:** Selenium finds elements but they have no values, or clicks don't work.

**Fix:** Always use `WebDriverWait` — never use `Thread.sleep()` blindly.
```java
// Add this wait after navigating
wait.until(ExpectedConditions.urlContains("/login"));
wait.until(ExpectedConditions.visibilityOfElementLocated(emailLocator));
```

---

## Quick Summary

```
Selenium = Robot that controls Chrome
WebDriver = The "hand" that interacts with the browser
Locator = Address of an HTML element (CSS or XPath)
Page Object = One class per page — stores locators and actions
BaseTest = Parent class — sets up and tears down the browser
WebDriverWait = Smart waiting (better than Thread.sleep)
@Test = A test case method
Assert = Verifies that the result is what you expected
testng.xml = Defines which tests to run and in what order
```

---

## Test Summary Table

| Test Class | Test ID | What it tests |
|---|---|---|
| LoginTest | TC01 | Login page loads with "Welcome Back" |
| LoginTest | TC02 | Valid admin login → redirects away from /login |
| LoginTest | TC03 | Wrong password → error snackbar appears |
| LoginTest | TC04 | Empty form submit → stays on /login |
| LoginTest | TC05 | Register link → navigates to /register |
| LoginTest | TC06 | Invalid email format → form validation rejects |
| RegisterTest | TC01 | Register page loads with "Create Account" |
| RegisterTest | TC02 | Sign In link → navigates to /login |
| RegisterTest | TC03 | Form fields accept user input |
| RegisterTest | TC04 | Empty form submit → stays on /register |
| RegisterTest | TC05 | Password field type is "password" (hidden) |
| RegisterTest | TC06 | All form fields (7 fields) are visible |
| UserDashboardTest | TC01 | After login URL contains /user |
| UserDashboardTest | TC02 | Request Blood sidebar link → /user/request-blood |
| UserDashboardTest | TC03 | My Requests sidebar link → /user/my-requests |
| UserDashboardTest | TC04 | Request Blood form has all required fields |
| UserDashboardTest | TC05 | Logout → navigates away from /user/dashboard |

**Total: 17 test cases**
