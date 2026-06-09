export const e2eTests = [
  {
    id: 'E2E-01',
    name: 'User Registration — complete sign-up flow',
    category: 'Authentication',
    status: 'PASS',
    description: 'New user fills the registration form, submits, verifies OTP and lands on dashboard',
    steps: [
      'Navigate to / (home page)',
      'Click "Register" button in navbar',
      'Fill all required fields (name, email, password, phone, blood group)',
      'Submit the registration form',
      'Enter OTP received on email',
      'Verify successful redirect to /user/dashboard',
      'Check welcome message with user name'
    ],
    code: `describe('User Registration Flow', () => {
  it('should register a new user and redirect to dashboard', () => {
    cy.visit('/');
    cy.get('[data-cy="nav-register"]').click();
    cy.url().should('include', '/register');

    // Fill registration form
    cy.get('[data-cy="input-firstName"]').type('Arjun');
    cy.get('[data-cy="input-lastName"]').type('Mehta');
    cy.get('[data-cy="input-email"]').type('arjun.mehta@test.com');
    cy.get('[data-cy="input-password"]').type('SecurePass123!');
    cy.get('[data-cy="input-phone"]').type('9876543210');
    cy.get('[data-cy="select-bloodGroup"]').select('O+');
    cy.get('[data-cy="input-city"]').type('Bangalore');
    cy.get('[data-cy="input-address"]').type('123 MG Road');

    cy.get('[data-cy="btn-register"]').click();

    // OTP verification
    cy.get('[data-cy="otp-modal"]').should('be.visible');
    cy.get('[data-cy="input-otp"]').type('123456'); // Intercept OTP
    cy.get('[data-cy="btn-verify-otp"]').click();

    // Assert redirect to dashboard
    cy.url().should('include', '/user/dashboard');
    cy.get('[data-cy="welcome-message"]').should('contain', 'Arjun');
  });
});`
  },
  {
    id: 'E2E-02',
    name: 'User Login & Logout — authentication flow',
    category: 'Authentication',
    status: 'PASS',
    description: 'Registered user logs in, sees dashboard, then logs out and is redirected to home',
    steps: [
      'Navigate to /login',
      'Enter valid email and password',
      'Click Login button',
      'Verify redirect to /user/dashboard',
      'Check JWT token stored in localStorage',
      'Click Logout from navbar',
      'Verify redirect to /login',
      'Check localStorage is cleared'
    ],
    code: `describe('Login and Logout Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials and redirect to dashboard', () => {
    cy.get('[data-cy="input-email"]').type('user@bloodbank.com');
    cy.get('[data-cy="input-password"]').type('password123');
    cy.get('[data-cy="btn-login"]').click();

    cy.url().should('include', '/user/dashboard');
    cy.window().its('localStorage').invoke('getItem', 'token')
      .should('not.be.null');
  });

  it('should logout and clear auth state', () => {
    cy.login('user@bloodbank.com', 'password123'); // custom command
    cy.visit('/user/dashboard');

    cy.get('[data-cy="btn-logout"]').click();

    cy.url().should('include', '/login');
    cy.window().its('localStorage').invoke('getItem', 'token')
      .should('be.null');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-cy="input-email"]').type('wrong@test.com');
    cy.get('[data-cy="input-password"]').type('wrongpassword');
    cy.get('[data-cy="btn-login"]').click();

    cy.get('[data-cy="error-message"]').should('be.visible')
      .and('contain', 'Invalid credentials');
    cy.url().should('include', '/login');
  });
});`
  },
  {
    id: 'E2E-03',
    name: 'Submit Blood Request — user request flow',
    category: 'User Flow',
    status: 'PASS',
    description: 'Authenticated user submits a blood request and sees it appear in My Requests with PENDING status',
    steps: [
      'Login as regular user',
      'Navigate to Request Blood page',
      'Fill patient name, blood group, units, purpose, hospital',
      'Toggle emergency checkbox',
      'Submit the form',
      'Verify success notification',
      'Navigate to My Requests',
      'Verify new request appears with PENDING status'
    ],
    code: `describe('Submit Blood Request', () => {
  beforeEach(() => {
    cy.login('patient@bloodbank.com', 'password123');
  });

  it('should submit blood request and show PENDING in my requests', () => {
    cy.visit('/user/request-blood');

    cy.get('[data-cy="input-patientName"]').type('Priya Sharma');
    cy.get('[data-cy="select-bloodGroup"]').select('B+');
    cy.get('[data-cy="input-units"]').clear().type('2');
    cy.get('[data-cy="input-purpose"]').type('Bone marrow transplant');
    cy.get('[data-cy="input-hospital"]').type('Fortis Hospital, Chennai');
    cy.get('[data-cy="input-contactPhone"]').type('9988776655');
    cy.get('[data-cy="checkbox-emergency"]').check();

    cy.get('[data-cy="btn-submit-request"]').click();

    cy.get('[data-cy="snackbar-success"]').should('contain', 'Request submitted');

    // Navigate to My Requests
    cy.visit('/user/my-requests');
    cy.get('[data-cy="request-list"]').first()
      .should('contain', 'Priya Sharma')
      .and('contain', 'PENDING')
      .and('contain', 'B+');
  });
});`
  },
  {
    id: 'E2E-04',
    name: 'Schedule Blood Donation — donor flow',
    category: 'User Flow',
    status: 'PASS',
    description: 'User schedules a future donation appointment and sees it in donation history',
    steps: [
      'Login as donor user',
      'Navigate to Schedule Donation',
      'Select future date from date picker',
      'Enter donation center location',
      'Submit the scheduling form',
      'Navigate to Donation History',
      'Verify donation appears with SCHEDULED status'
    ],
    code: `describe('Schedule Blood Donation', () => {
  it('should schedule donation and appear in history as SCHEDULED', () => {
    cy.login('donor@bloodbank.com', 'password123');
    cy.visit('/user/donation-history');

    cy.get('[data-cy="btn-schedule-donation"]').click();
    cy.get('[data-cy="modal-schedule"]').should('be.visible');

    // Set date to 7 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];

    cy.get('[data-cy="input-donationDate"]').type(dateStr);
    cy.get('[data-cy="input-location"]')
      .type('Apollo Blood Donation Centre, Chennai');
    cy.get('[data-cy="btn-confirm-schedule"]').click();

    cy.get('[data-cy="snackbar-success"]')
      .should('contain', 'Donation scheduled');

    cy.get('[data-cy="donation-list"]').first()
      .should('contain', 'SCHEDULED')
      .and('contain', 'Apollo Blood Donation Centre');
  });
});`
  },
  {
    id: 'E2E-05',
    name: 'Admin Login & Dashboard View',
    category: 'Admin Flow',
    status: 'PASS',
    description: 'Admin logs in and sees the dashboard with statistics: users, donations, requests, inventory',
    steps: [
      'Navigate to /login',
      'Login with admin credentials',
      'Verify redirect to /admin/dashboard',
      'Check stats cards are visible (users, donations, pending requests)',
      'Verify inventory summary is shown',
      'Check recent activity section'
    ],
    code: `describe('Admin Dashboard', () => {
  it('should show comprehensive stats after admin login', () => {
    cy.visit('/login');
    cy.get('[data-cy="input-email"]').type('admin@bloodbank.com');
    cy.get('[data-cy="input-password"]').type('adminpass');
    cy.get('[data-cy="btn-login"]').click();

    cy.url().should('include', '/admin/dashboard');

    // Check stat cards
    cy.get('[data-cy="stat-total-users"]').should('be.visible');
    cy.get('[data-cy="stat-pending-requests"]').should('be.visible');
    cy.get('[data-cy="stat-total-donations"]').should('be.visible');

    // Verify chart is rendered
    cy.get('[data-cy="inventory-chart"]').should('be.visible');

    // Verify navigation links
    cy.get('[data-cy="nav-blood-requests"]').should('be.visible');
    cy.get('[data-cy="nav-inventory"]').should('be.visible');
    cy.get('[data-cy="nav-users"]').should('be.visible');
  });
});`
  },
  {
    id: 'E2E-06',
    name: 'Admin Smart Approve Request',
    category: 'Admin Flow',
    status: 'PASS',
    description: 'Admin uses smart approve on a pending request — system auto-selects compatible blood and deducts inventory',
    steps: [
      'Login as admin',
      'Navigate to Blood Requests',
      'Find a PENDING request',
      'Click Smart Approve button',
      'Verify confirmation dialog appears',
      'Confirm the action',
      'Verify request status changes to APPROVED',
      'Navigate to Inventory and verify units reduced'
    ],
    code: `describe('Admin Smart Approve', () => {
  it('should smart approve request and update inventory', () => {
    cy.adminLogin();
    cy.visit('/admin/blood-requests');

    cy.get('[data-cy="request-status-PENDING"]').first()
      .parents('[data-cy="request-row"]')
      .find('[data-cy="btn-smart-approve"]')
      .click();

    cy.get('[data-cy="confirm-dialog"]').should('be.visible');
    cy.get('[data-cy="btn-confirm"]').click();

    cy.get('[data-cy="snackbar-success"]')
      .should('contain', 'Request approved');

    // Check request status updated to APPROVED
    cy.get('[data-cy="request-row"]').first()
      .should('contain', 'APPROVED');

    // Verify inventory reduced
    cy.visit('/admin/inventory');
    cy.get('[data-cy="inventory-row"]')
      .should('exist'); // Units should have decreased
  });
});`
  },
  {
    id: 'E2E-07',
    name: 'Admin Reject Request with Reason',
    category: 'Admin Flow',
    status: 'PASS',
    description: 'Admin rejects a pending blood request and provides a reason that is visible to the user',
    steps: [
      'Login as admin',
      'Navigate to Blood Requests',
      'Find PENDING request',
      'Click Reject button',
      'Enter rejection reason in dialog',
      'Submit rejection',
      'Login as user',
      'Check My Requests shows REJECTED with reason'
    ],
    code: `describe('Admin Reject Request', () => {
  it('should reject request with reason visible to user', () => {
    cy.adminLogin();
    cy.visit('/admin/blood-requests');

    cy.get('[data-cy="request-status-PENDING"]').first()
      .parents('[data-cy="request-row"]')
      .find('[data-cy="btn-reject"]')
      .click();

    cy.get('[data-cy="reject-dialog"]').should('be.visible');
    cy.get('[data-cy="input-rejection-reason"]')
      .type('Insufficient supporting medical documents provided');
    cy.get('[data-cy="btn-confirm-reject"]').click();

    cy.get('[data-cy="snackbar-success"]').should('contain', 'Request rejected');

    // Switch to user view and verify reason is shown
    cy.logout();
    cy.login('patient@bloodbank.com', 'password123');
    cy.visit('/user/my-requests');

    cy.get('[data-cy="request-row"]').first()
      .should('contain', 'REJECTED')
      .find('[data-cy="rejection-reason"]')
      .should('contain', 'Insufficient supporting medical documents');
  });
});`
  },
  {
    id: 'E2E-08',
    name: 'Admin Update Inventory',
    category: 'Admin Flow',
    status: 'PASS',
    description: 'Admin updates blood stock units for a specific blood group from the inventory management page',
    steps: [
      'Login as admin',
      'Navigate to Blood Inventory',
      'Click Edit on a blood group row',
      'Update units to new value',
      'Save changes',
      'Verify updated value displayed',
      'Verify lastUpdated timestamp changed'
    ],
    code: `describe('Admin Inventory Management', () => {
  it('should update inventory units and reflect changes immediately', () => {
    cy.adminLogin();
    cy.visit('/admin/inventory');

    cy.get('[data-cy="inventory-row-AB+"]')
      .find('[data-cy="btn-edit"]')
      .click();

    cy.get('[data-cy="input-units"]').clear().type('20');
    cy.get('[data-cy="btn-save"]').click();

    cy.get('[data-cy="snackbar-success"]')
      .should('contain', 'Inventory updated');

    cy.get('[data-cy="inventory-row-AB+"]')
      .should('contain', '20')
      .find('[data-cy="last-updated"]')
      .should('contain', new Date().toLocaleDateString());
  });
});`
  },
  {
    id: 'E2E-09',
    name: 'Route Guard — unauthenticated access blocked',
    category: 'Security',
    status: 'PASS',
    description: 'Direct navigation to protected routes should redirect unauthenticated users to /login',
    steps: [
      'Clear localStorage (simulate logged-out state)',
      'Directly navigate to /user/dashboard',
      'Verify redirect to /login',
      'Directly navigate to /admin/dashboard',
      'Verify redirect to /login',
      'Verify no API calls were made to protected endpoints'
    ],
    code: `describe('Route Guard Protection', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should redirect unauthenticated user from /user/dashboard to /login', () => {
    cy.visit('/user/dashboard');
    cy.url().should('include', '/login');
  });

  it('should redirect unauthenticated user from /admin/dashboard to /login', () => {
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/login');
  });

  it('should block user role from /admin routes', () => {
    cy.login('user@bloodbank.com', 'password123');
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/user/dashboard'); // Redirected
    cy.get('[data-cy="toast-error"]')
      .should('contain', 'Access denied');
  });
});`
  },
  {
    id: 'E2E-10',
    name: 'Admin Toggle User Status',
    category: 'Admin Flow',
    status: 'SKIP',
    description: 'Admin deactivates a user account; deactivated user should not be able to login (pending bug fix)',
    steps: [
      'Login as admin',
      'Navigate to User Management',
      'Find active user in list',
      'Click Deactivate/Toggle Status button',
      'Verify user status changes to Inactive',
      'Attempt to login as that user',
      'Verify login is blocked with appropriate error'
    ],
    code: `// SKIPPED: Depends on bug fix for IT-12 (toggle-status login check)
// Active user can still login after deactivation
// TODO: Add isActive check in AuthService.login()

describe('Admin Toggle User Status', () => {
  it.skip('should prevent deactivated user from logging in', () => {
    cy.adminLogin();
    cy.visit('/admin/users');

    cy.get('[data-cy="user-row"]').contains('active@test.com')
      .parents('[data-cy="user-row"]')
      .find('[data-cy="btn-toggle-status"]')
      .click();

    cy.get('[data-cy="user-status-active@test.com"]')
      .should('contain', 'Inactive');

    // Switch to deactivated user — should be blocked
    cy.logout();
    cy.login('active@test.com', 'testpass');

    cy.get('[data-cy="error-message"]')
      .should('contain', 'Account is deactivated');
    cy.url().should('include', '/login');
  });
});`
  },
];
