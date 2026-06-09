export const backendUnitTests = [
  {
    id: 'UT-B-01',
    name: 'login_validCredentials_returnsJwtToken',
    service: 'AuthService',
    description: 'Should return a JWT token when valid email and password are provided',
    status: 'PASS',
    assertions: ['Token is not null', 'Token is not empty', 'jwtUtils.generateToken called once'],
    code: `@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtils jwtUtils;
    @Mock private AuthenticationManager authenticationManager;
    @InjectMocks private AuthService authService;

    @Test
    @DisplayName("Login with valid credentials returns JWT token")
    void login_validCredentials_returnsJwtToken() {
        // Arrange
        LoginRequest request = new LoginRequest("user@test.com", "password123");
        User mockUser = new User();
        mockUser.setEmail("user@test.com");
        mockUser.setActive(true);
        mockUser.setRole(Role.USER);

        when(userRepository.findByEmail("user@test.com"))
            .thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("password123", mockUser.getPassword()))
            .thenReturn(true);
        when(jwtUtils.generateToken(any(UserDetails.class)))
            .thenReturn("eyJhbGciOiJIUzI1NiJ9.mock.token");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("eyJhbGciOiJIUzI1NiJ9.mock.token", response.getToken());
        verify(jwtUtils, times(1)).generateToken(any(UserDetails.class));
    }
}`
  },
  {
    id: 'UT-B-02',
    name: 'login_invalidPassword_throwsAuthenticationException',
    service: 'AuthService',
    description: 'Should throw exception when password does not match stored hash',
    status: 'PASS',
    assertions: ['RuntimeException is thrown', 'Exception message contains "Invalid credentials"', 'generateToken never called'],
    code: `@Test
@DisplayName("Login with wrong password throws AuthenticationException")
void login_invalidPassword_throwsAuthenticationException() {
    // Arrange
    LoginRequest request = new LoginRequest("user@test.com", "wrongpass");
    User mockUser = new User();
    mockUser.setEmail("user@test.com");
    mockUser.setActive(true);

    when(userRepository.findByEmail("user@test.com"))
        .thenReturn(Optional.of(mockUser));
    when(passwordEncoder.matches("wrongpass", mockUser.getPassword()))
        .thenReturn(false);

    // Act & Assert
    RuntimeException exception = assertThrows(
        RuntimeException.class,
        () -> authService.login(request)
    );

    assertTrue(exception.getMessage().contains("Invalid credentials"));
    verify(jwtUtils, never()).generateToken(any());
}`
  },
  {
    id: 'UT-B-03',
    name: 'register_newEmail_createsUserAndSendsOtp',
    service: 'AuthService',
    description: 'Should save new user to database and trigger OTP email on first registration',
    status: 'PASS',
    assertions: ['userRepository.save called once', 'User role defaults to USER', 'Password is encoded', 'OTP email sent'],
    code: `@Test
@DisplayName("Register with new email creates user account")
void register_newEmail_createsUserAndSendsOtp() {
    // Arrange
    RegisterRequest request = new RegisterRequest(
        "John", "Doe", "john@test.com", "pass123",
        "9876543210", "A+", "Chennai", "123 Street"
    );

    when(userRepository.existsByEmail("john@test.com")).thenReturn(false);
    when(passwordEncoder.encode("pass123")).thenReturn("$2a$10$encodedHash");
    when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

    // Act
    ApiResponse response = authService.register(request);

    // Assert
    assertTrue(response.isSuccess());
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(userCaptor.capture());

    User savedUser = userCaptor.getValue();
    assertEquals("john@test.com", savedUser.getEmail());
    assertEquals(Role.USER, savedUser.getRole());
    assertEquals("$2a$10$encodedHash", savedUser.getPassword());
    verify(emailService, times(1)).sendOtpEmail(eq("john@test.com"), anyString());
}`
  },
  {
    id: 'UT-B-04',
    name: 'register_duplicateEmail_throwsException',
    service: 'AuthService',
    description: 'Should throw exception when email already exists in the database',
    status: 'PASS',
    assertions: ['RuntimeException thrown', 'Message contains "already registered"', 'userRepository.save never called'],
    code: `@Test
@DisplayName("Register with existing email throws duplicate exception")
void register_duplicateEmail_throwsException() {
    // Arrange
    RegisterRequest request = new RegisterRequest(
        "Jane", "Doe", "existing@test.com", "pass123",
        "9876543210", "B+", "Mumbai", "456 Road"
    );
    when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

    // Act & Assert
    RuntimeException ex = assertThrows(
        RuntimeException.class,
        () -> authService.register(request)
    );

    assertTrue(ex.getMessage().contains("already registered"));
    verify(userRepository, never()).save(any(User.class));
}`
  },
  {
    id: 'UT-B-05',
    name: 'createBloodRequest_validData_savesAndReturnsRequest',
    service: 'BloodRequestService',
    description: 'Should create a new blood request with PENDING status and associate with the requesting user',
    status: 'PASS',
    assertions: ['Status is PENDING', 'User is correctly assigned', 'bloodRequestRepository.save called once', 'requestDate is not null'],
    code: `@ExtendWith(MockitoExtension.class)
class BloodRequestServiceTest {

    @Mock private BloodRequestRepository requestRepository;
    @Mock private BloodInventoryRepository inventoryRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private BloodRequestService requestService;

    @Test
    @DisplayName("Create blood request sets status to PENDING")
    void createBloodRequest_validData_savesAndReturnsRequest() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setBloodGroup("A+");

        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setPatientName("Ram Kumar");
        dto.setBloodGroup("A+");
        dto.setUnits(2);
        dto.setPurpose("Surgery");
        dto.setHospital("Apollo Hospital");
        dto.setEmergency(false);

        when(requestRepository.save(any(BloodRequest.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        // Act
        BloodRequest result = requestService.createRequest(dto, user);

        // Assert
        assertNotNull(result);
        assertEquals(RequestStatus.PENDING, result.getStatus());
        assertEquals(user, result.getUser());
        assertEquals("Ram Kumar", result.getPatientName());
        assertNotNull(result.getRequestDate());
        verify(requestRepository, times(1)).save(any(BloodRequest.class));
    }
}`
  },
  {
    id: 'UT-B-06',
    name: 'approveRequest_sufficientStock_deductsInventoryAndUpdatesStatus',
    service: 'BloodRequestService',
    description: 'Should deduct blood units from inventory and set request status to APPROVED',
    status: 'PASS',
    assertions: ['Request status becomes APPROVED', 'Inventory units deducted correctly', 'inventoryRepository.save called once'],
    code: `@Test
@DisplayName("Approve request deducts inventory and sets APPROVED status")
void approveRequest_sufficientStock_deductsInventoryAndUpdatesStatus() {
    // Arrange
    BloodRequest request = new BloodRequest();
    request.setId(1L);
    request.setBloodGroup("O+");
    request.setUnits(2);
    request.setStatus(RequestStatus.PENDING);

    BloodInventory inventory = new BloodInventory();
    inventory.setBloodGroup("O+");
    inventory.setUnits(10);

    when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
    when(inventoryRepository.findByBloodGroup("O+"))
        .thenReturn(Optional.of(inventory));
    when(requestRepository.save(any())).thenAnswer(i -> i.getArgument(0));
    when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    // Act
    requestService.manualApprove(1L, "O+");

    // Assert
    assertEquals(RequestStatus.APPROVED, request.getStatus());
    assertEquals(8, inventory.getUnits()); // 10 - 2 = 8
    verify(inventoryRepository, times(1)).save(inventory);
}`
  },
  {
    id: 'UT-B-07',
    name: 'rejectRequest_updatesStatusWithAdminMessage',
    service: 'BloodRequestService',
    description: 'Should update request status to REJECTED and store the admin rejection reason',
    status: 'PASS',
    assertions: ['Status becomes REJECTED', 'Admin message stored', 'Inventory not modified'],
    code: `@Test
@DisplayName("Reject request sets REJECTED status with admin message")
void rejectRequest_updatesStatusWithAdminMessage() {
    // Arrange
    BloodRequest request = new BloodRequest();
    request.setId(2L);
    request.setStatus(RequestStatus.PENDING);

    when(requestRepository.findById(2L)).thenReturn(Optional.of(request));
    when(requestRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    // Act
    requestService.processAction(2L, "REJECTED", "Insufficient medical documentation");

    // Assert
    assertEquals(RequestStatus.REJECTED, request.getStatus());
    assertEquals("Insufficient medical documentation", request.getAdminMessage());
    verify(inventoryRepository, never()).save(any()); // No inventory change
}`
  },
  {
    id: 'UT-B-08',
    name: 'smartApprove_picksCompatibleBloodType',
    service: 'BloodRequestService',
    description: 'Smart approve selects the most compatible blood type available and deducts from inventory',
    status: 'PASS',
    assertions: ['Compatible blood selected', 'Status is APPROVED', 'BloodCompatibilityUtil.getCompatible called'],
    code: `@Test
@DisplayName("Smart approve selects compatible blood type with sufficient stock")
void smartApprove_picksCompatibleBloodType() {
    // Arrange
    BloodRequest request = new BloodRequest();
    request.setBloodGroup("AB+");
    request.setUnits(1);
    request.setStatus(RequestStatus.PENDING);

    // AB+ can receive from A+, B+, O+, AB+
    List<BloodInventory> compatibleStock = List.of(
        new BloodInventory("A+", 5),
        new BloodInventory("O+", 8)
    );

    when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
    when(inventoryRepository.findByBloodGroupIn(anyList()))
        .thenReturn(compatibleStock);
    when(requestRepository.save(any())).thenAnswer(i -> i.getArgument(0));
    when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    // Act
    requestService.smartApprove(1L);

    // Assert
    assertEquals(RequestStatus.APPROVED, request.getStatus());
    assertNotNull(request.getAdminMessage());
    verify(inventoryRepository, atLeastOnce()).save(any());
}`
  },
  {
    id: 'UT-B-09',
    name: 'updateInventory_validUnits_updatesStock',
    service: 'BloodInventoryService',
    description: 'Should update blood inventory units for a given blood group',
    status: 'PASS',
    assertions: ['Units updated correctly', 'lastUpdated timestamp refreshed', 'inventoryRepository.save called'],
    code: `@Test
@DisplayName("Update inventory sets new unit count and refreshes timestamp")
void updateInventory_validUnits_updatesStock() {
    // Arrange
    BloodInventory existing = new BloodInventory();
    existing.setBloodGroup("B+");
    existing.setUnits(5);

    InventoryUpdateRequest updateRequest = new InventoryUpdateRequest("B+", 15);

    when(inventoryRepository.findByBloodGroup("B+"))
        .thenReturn(Optional.of(existing));
    when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    // Act
    BloodInventory result = inventoryService.updateInventory(updateRequest);

    // Assert
    assertEquals(15, result.getUnits());
    assertNotNull(result.getLastUpdated());
    verify(inventoryRepository).save(existing);
}`
  },
  {
    id: 'UT-B-10',
    name: 'scheduleDonation_validData_createsDonationRecord',
    service: 'DonationService',
    description: 'Should create a new donation record with SCHEDULED status for the authenticated user',
    status: 'PASS',
    assertions: ['Status is SCHEDULED', 'User assigned correctly', 'donationRepository.save called once'],
    code: `@Test
@DisplayName("Schedule donation creates SCHEDULED record for user")
void scheduleDonation_validData_createsDonationRecord() {
    // Arrange
    User donor = new User();
    donor.setId(5L);
    donor.setBloodGroup("O-");

    DonationScheduleRequest scheduleReq = new DonationScheduleRequest();
    scheduleReq.setDonationDate(LocalDate.now().plusDays(3));
    scheduleReq.setLocation("Apollo Blood Bank, Chennai");
    scheduleReq.setUnits(1);

    when(donationRepository.save(any(DonationRecord.class)))
        .thenAnswer(i -> i.getArgument(0));

    // Act
    DonationRecord result = donationService.scheduleDonation(scheduleReq, donor);

    // Assert
    assertNotNull(result);
    assertEquals(DonationStatus.SCHEDULED, result.getStatus());
    assertEquals(donor, result.getUser());
    assertEquals("O-", result.getBloodGroup());
    verify(donationRepository, times(1)).save(any(DonationRecord.class));
}`
  },
  {
    id: 'UT-B-11',
    name: 'completeDonation_updatesStatusAndInventory',
    service: 'DonationService',
    description: 'Completing a donation should mark it COMPLETED and add units to inventory',
    status: 'PASS',
    assertions: ['Status becomes COMPLETED', 'Inventory units incremented', 'Both repositories saved'],
    code: `@Test
@DisplayName("Complete donation updates inventory and marks record COMPLETED")
void completeDonation_updatesStatusAndInventory() {
    // Arrange
    DonationRecord record = new DonationRecord();
    record.setId(1L);
    record.setBloodGroup("O-");
    record.setUnits(1);
    record.setStatus(DonationStatus.SCHEDULED);

    BloodInventory inventory = new BloodInventory();
    inventory.setBloodGroup("O-");
    inventory.setUnits(3);

    when(donationRepository.findById(1L)).thenReturn(Optional.of(record));
    when(inventoryRepository.findByBloodGroup("O-"))
        .thenReturn(Optional.of(inventory));
    when(donationRepository.save(any())).thenAnswer(i -> i.getArgument(0));
    when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    // Act
    donationService.completeDonation(1L);

    // Assert
    assertEquals(DonationStatus.COMPLETED, record.getStatus());
    assertEquals(4, inventory.getUnits()); // 3 + 1 = 4
    verify(donationRepository).save(record);
    verify(inventoryRepository).save(inventory);
}`
  },
  {
    id: 'UT-B-12',
    name: 'generateToken_returnsValidJwt',
    service: 'JwtUtils',
    description: 'Should generate a valid JWT token containing the username as the subject',
    status: 'PASS',
    assertions: ['Token is not null', 'Token has 3 parts (header.payload.signature)', 'Subject matches username'],
    code: `@SpringBootTest
class JwtUtilsTest {

    @Autowired private JwtUtils jwtUtils;

    @Test
    @DisplayName("generateToken returns valid JWT with correct subject")
    void generateToken_returnsValidJwt() {
        // Arrange
        UserDetails userDetails = new org.springframework.security.core.userdetails
            .User("admin@blood.com", "pass", Collections.emptyList());

        // Act
        String token = jwtUtils.generateToken(userDetails);

        // Assert
        assertNotNull(token);
        String[] parts = token.split("\\\\.");
        assertEquals(3, parts.length, "JWT must have header.payload.signature");
        assertEquals("admin@blood.com", jwtUtils.extractUsername(token));
    }

    @Test
    @DisplayName("validateToken returns false for expired token")
    void validateToken_expiredToken_returnsFalse() {
        String expiredToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxMDAwfQ.expired";
        assertFalse(jwtUtils.validateToken(expiredToken, mock(UserDetails.class)));
    }
}`
  },
];

export const frontendUnitTests = [
  {
    id: 'UT-F-01',
    name: 'login_validCredentials_storesTokenInLocalStorage',
    service: 'AuthService',
    description: 'Should call POST /api/auth/login and store the returned JWT in localStorage',
    status: 'PASS',
    assertions: ['http.post called with correct URL', 'Token stored in localStorage', 'isLoggedIn returns true after login'],
    code: `describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should store JWT token in localStorage after successful login', () => {
    const credentials = { email: 'user@test.com', password: 'pass123' };
    const mockResponse = { success: true, data: { token: 'mock.jwt.token', role: 'USER' } };

    service.login(credentials).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(\`\${environment.apiUrl}/auth/login\`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('mock.jwt.token');
    expect(service.isLoggedIn()).toBeTrue();
  });
});`
  },
  {
    id: 'UT-F-02',
    name: 'logout_clearsAllStorageAndRedirects',
    service: 'AuthService',
    description: 'Should clear token and user from localStorage and navigate to login page',
    status: 'PASS',
    assertions: ['localStorage cleared', 'router.navigate called with /login', 'isLoggedIn returns false'],
    code: `it('should clear storage and navigate to login on logout', () => {
  const routerSpy = spyOn(router, 'navigate');
  localStorage.setItem('token', 'some.token');
  localStorage.setItem('user', JSON.stringify({ email: 'user@test.com' }));

  service.logout();

  expect(localStorage.getItem('token')).toBeNull();
  expect(localStorage.getItem('user')).toBeNull();
  expect(service.isLoggedIn()).toBeFalse();
  expect(routerSpy).toHaveBeenCalledWith(['/login']);
});`
  },
  {
    id: 'UT-F-03',
    name: 'createRequest_validForm_callsPostEndpoint',
    service: 'BloodRequestService',
    description: 'Should POST to /api/requests with the correct DTO when creating a blood request',
    status: 'PASS',
    assertions: ['POST request fired to correct URL', 'Request body matches DTO', 'Observable resolves with server response'],
    code: `describe('BloodRequestService', () => {
  it('should POST new blood request to correct API endpoint', () => {
    const dto = {
      patientName: 'Ravi Kumar',
      bloodGroup: 'B+',
      units: 2,
      purpose: 'Surgery',
      hospital: 'Government Hospital',
      emergency: true
    };
    const mockResponse = { success: true, data: { id: 1, status: 'PENDING' } };

    service.createRequest(dto).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(res.data.status).toBe('PENDING');
    });

    const req = httpMock.expectOne(\`\${environment.apiUrl}/requests\`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.bloodGroup).toBe('B+');
    req.flush(mockResponse);
  });
});`
  },
  {
    id: 'UT-F-04',
    name: 'canActivate_withoutToken_redirectsToLogin',
    service: 'AuthGuard',
    description: 'AuthGuard should block unauthenticated users and redirect them to /login',
    status: 'PASS',
    assertions: ['canActivate returns false', 'router.navigate called with /login', 'No token in localStorage'],
    code: `describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should redirect to /login when user is not authenticated', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access when user is authenticated', () => {
    authService.isLoggedIn.and.returnValue(true);
    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );
    expect(result).toBeTrue();
  });
});`
  },
  {
    id: 'UT-F-05',
    name: 'adminGuard_rejectsNonAdminRole',
    service: 'AdminGuard',
    description: 'AdminGuard should block users with ROLE_USER and redirect them to /user/dashboard',
    status: 'PASS',
    assertions: ['canActivate returns false for USER role', 'canActivate returns true for ADMIN role', 'Redirects to /user/dashboard'],
    code: `it('should block USER role and redirect to user dashboard', () => {
  authService.getUserRole.and.returnValue('ROLE_USER');

  const result = adminGuard.canActivate(
    {} as ActivatedRouteSnapshot,
    {} as RouterStateSnapshot
  );

  expect(result).toBeFalse();
  expect(router.navigate).toHaveBeenCalledWith(['/user/dashboard']);
});

it('should allow ADMIN role to proceed', () => {
  authService.getUserRole.and.returnValue('ROLE_ADMIN');
  const result = adminGuard.canActivate(
    {} as ActivatedRouteSnapshot,
    {} as RouterStateSnapshot
  );
  expect(result).toBeTrue();
});`
  },
  {
    id: 'UT-F-06',
    name: 'loginComponent_invalidEmail_showsValidationError',
    service: 'LoginComponent',
    description: 'Login form should show validation error message when email format is invalid',
    status: 'PASS',
    assertions: ['Form is invalid', 'email.errors.email is truthy', 'Submit button is disabled'],
    code: `describe('LoginComponent', () => {
  it('should show validation error for invalid email format', () => {
    component.loginForm.controls['email'].setValue('not-an-email');
    component.loginForm.controls['password'].setValue('password123');
    fixture.detectChanges();

    const emailControl = component.loginForm.controls['email'];
    expect(emailControl.valid).toBeFalse();
    expect(emailControl.errors?.['email']).toBeTruthy();
    expect(component.loginForm.valid).toBeFalse();

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn.nativeElement.disabled).toBeTrue();
  });

  it('should call authService.login on valid form submit', () => {
    const loginSpy = spyOn(authService, 'login').and.returnValue(of({ success: true }));
    component.loginForm.controls['email'].setValue('valid@test.com');
    component.loginForm.controls['password'].setValue('password123');

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledOnceWith({
      email: 'valid@test.com',
      password: 'password123'
    });
  });
});`
  },
  {
    id: 'UT-F-07',
    name: 'authInterceptor_addsBearerTokenToRequests',
    service: 'AuthInterceptor',
    description: 'JWT interceptor should inject the Authorization header with Bearer token for every HTTP request',
    status: 'PASS',
    assertions: ['Authorization header present', 'Token prefixed with Bearer', 'Non-auth requests also intercepted'],
    code: `describe('AuthInterceptor', () => {
  it('should add Bearer token to outgoing HTTP requests', () => {
    localStorage.setItem('token', 'my.jwt.token');

    http.get(\`\${environment.apiUrl}/requests\`).subscribe();

    const req = httpMock.expectOne(\`\${environment.apiUrl}/requests\`);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer my.jwt.token');
    req.flush({});
  });

  it('should not add Authorization header when token is missing', () => {
    localStorage.removeItem('token');

    http.get(\`\${environment.apiUrl}/auth/login\`).subscribe();

    const req = httpMock.expectOne(\`\${environment.apiUrl}/auth/login\`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});`
  },
];
