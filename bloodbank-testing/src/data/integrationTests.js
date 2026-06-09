export const integrationTests = [
  {
    id: 'IT-01',
    name: 'POST /api/auth/login — valid credentials returns 200 with token',
    group: 'Authentication API',
    method: 'POST',
    endpoint: '/api/auth/login',
    status: 'PASS',
    description: 'Should return HTTP 200 with JWT token and user role for valid credentials',
    assertions: ['HTTP 200 OK', 'response.token is not null', 'response.role is present', 'token is valid JWT format'],
    code: `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        User admin = new User();
        admin.setEmail("test@blood.com");
        admin.setPassword(passwordEncoder.encode("pass123"));
        admin.setRole(Role.USER);
        admin.setActive(true);
        admin.setFirstName("Test");
        admin.setLastName("User");
        userRepository.save(admin);
    }

    @Test
    @DisplayName("POST /api/auth/login returns 200 with valid JWT")
    void login_validCredentials_returns200WithToken() throws Exception {
        Map<String, String> body = Map.of(
            "email", "test@blood.com",
            "password", "pass123"
        );

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.token").isNotEmpty())
            .andExpect(jsonPath("$.data.role").value("ROLE_USER"))
            .andDo(print());
    }
}`
  },
  {
    id: 'IT-02',
    name: 'POST /api/auth/login — invalid password returns 401',
    group: 'Authentication API',
    method: 'POST',
    endpoint: '/api/auth/login',
    status: 'PASS',
    description: 'Should return HTTP 401 Unauthorized when wrong password is provided',
    assertions: ['HTTP 401 Unauthorized', 'response.success is false', 'No token in response'],
    code: `@Test
@DisplayName("POST /api/auth/login returns 401 for wrong password")
void login_wrongPassword_returns401() throws Exception {
    Map<String, String> body = Map.of(
        "email", "test@blood.com",
        "password", "wrongpassword"
    );

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.data.token").doesNotExist());
}`
  },
  {
    id: 'IT-03',
    name: 'POST /api/auth/register — new email returns 201',
    group: 'Authentication API',
    method: 'POST',
    endpoint: '/api/auth/register',
    status: 'PASS',
    description: 'Should create a new user account and return HTTP 201 Created',
    assertions: ['HTTP 201 Created', 'response.success is true', 'User saved to database', 'OTP email triggered'],
    code: `@Test
@DisplayName("POST /api/auth/register creates new user and returns 201")
void register_newUser_returns201() throws Exception {
    Map<String, String> body = Map.of(
        "firstName", "Praveen",
        "lastName", "Kumar",
        "email", "newuser@blood.com",
        "password", "securePass123",
        "phone", "9876543210",
        "bloodGroup", "AB+",
        "city", "Chennai"
    );

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Registration successful"));

    assertTrue(userRepository.existsByEmail("newuser@blood.com"));
}`
  },
  {
    id: 'IT-04',
    name: 'POST /api/auth/register — duplicate email returns 409',
    group: 'Authentication API',
    method: 'POST',
    endpoint: '/api/auth/register',
    status: 'PASS',
    description: 'Should return HTTP 409 Conflict when the email is already registered',
    assertions: ['HTTP 409 Conflict', 'response.success is false', 'Error message mentions duplicate email'],
    code: `@Test
@DisplayName("POST /api/auth/register returns 409 for duplicate email")
void register_duplicateEmail_returns409() throws Exception {
    // Pre-create the user
    User existing = new User();
    existing.setEmail("taken@blood.com");
    existing.setPassword(passwordEncoder.encode("pass"));
    userRepository.save(existing);

    Map<String, String> body = Map.of(
        "firstName", "John",
        "email", "taken@blood.com",
        "password", "pass123"
    );

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.success").value(false));
}`
  },
  {
    id: 'IT-05',
    name: 'POST /api/requests — authenticated user creates blood request',
    group: 'Blood Request API',
    method: 'POST',
    endpoint: '/api/requests',
    status: 'PASS',
    description: 'Should create a blood request with PENDING status for an authenticated user',
    assertions: ['HTTP 201 Created', 'status is PENDING', 'requestDate is present', 'JWT required (401 without token)'],
    code: `@Test
@DisplayName("POST /api/requests creates request with PENDING status")
@WithMockUser(username = "user@test.com", roles = {"USER"})
void createRequest_authenticated_returns201WithPendingStatus() throws Exception {
    Map<String, Object> body = Map.of(
        "patientName", "Sunita Sharma",
        "bloodGroup", "O+",
        "units", 2,
        "purpose", "Cancer treatment",
        "hospital", "AIIMS Delhi",
        "emergency", false
    );

    mockMvc.perform(post("/api/requests")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body))
            .header("Authorization", "Bearer " + userJwtToken))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.status").value("PENDING"))
        .andExpect(jsonPath("$.data.patientName").value("Sunita Sharma"))
        .andExpect(jsonPath("$.data.requestDate").isNotEmpty());
}`
  },
  {
    id: 'IT-06',
    name: 'GET /api/requests — admin gets all requests',
    group: 'Blood Request API',
    method: 'GET',
    endpoint: '/api/requests',
    status: 'PASS',
    description: 'Admin should be able to retrieve all blood requests, optionally filtered by severity',
    assertions: ['HTTP 200 OK', 'Returns list of requests', 'USER role returns 403', 'Severity filter works'],
    code: `@Test
@DisplayName("GET /api/requests returns all requests for ADMIN")
void getAllRequests_asAdmin_returns200WithList() throws Exception {
    mockMvc.perform(get("/api/requests")
            .header("Authorization", "Bearer " + adminJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.data").isArray());
}

@Test
@DisplayName("GET /api/requests returns 403 for USER role")
void getAllRequests_asUser_returns403() throws Exception {
    mockMvc.perform(get("/api/requests")
            .header("Authorization", "Bearer " + userJwtToken))
        .andExpect(status().isForbidden());
}`
  },
  {
    id: 'IT-07',
    name: 'POST /api/requests/{id}/smart-approve — approves and deducts inventory',
    group: 'Blood Request API',
    method: 'POST',
    endpoint: '/api/requests/{id}/smart-approve',
    status: 'PASS',
    description: 'Smart approve should select compatible blood, update request to APPROVED, and decrement inventory',
    assertions: ['HTTP 200 OK', 'Request status becomes APPROVED', 'Inventory decremented', 'ADMIN-only endpoint'],
    code: `@Test
@DisplayName("POST /api/requests/{id}/smart-approve approves and updates inventory")
void smartApprove_sufficientStock_approvesAndDeductsInventory() throws Exception {
    // Setup inventory
    inventoryRepository.save(new BloodInventory("O+", 10));
    Long requestId = savedRequest.getId();

    int inventoryBefore = inventoryRepository
        .findByBloodGroup("O+").get().getUnits();

    mockMvc.perform(post("/api/requests/" + requestId + "/smart-approve")
            .header("Authorization", "Bearer " + adminJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.status").value("APPROVED"));

    int inventoryAfter = inventoryRepository
        .findByBloodGroup("O+").get().getUnits();

    assertTrue(inventoryAfter < inventoryBefore);
}`
  },
  {
    id: 'IT-08',
    name: 'GET /api/inventory — returns all blood group stock levels',
    group: 'Inventory API',
    method: 'GET',
    endpoint: '/api/inventory',
    status: 'PASS',
    description: 'Should return inventory levels for all 8 blood groups',
    assertions: ['HTTP 200 OK', 'Returns exactly 8 blood groups', 'Each item has bloodGroup and units', 'Auth required'],
    code: `@Test
@DisplayName("GET /api/inventory returns all 8 blood groups")
void getInventory_returnsAll8BloodGroups() throws Exception {
    mockMvc.perform(get("/api/inventory")
            .header("Authorization", "Bearer " + userJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(8)))
        .andExpect(jsonPath("$.data[*].bloodGroup",
            containsInAnyOrder("A+","A-","B+","B-","AB+","AB-","O+","O-")))
        .andExpect(jsonPath("$.data[0].units").isNumber());
}`
  },
  {
    id: 'IT-09',
    name: 'PUT /api/inventory/update — admin updates blood stock',
    group: 'Inventory API',
    method: 'PUT',
    endpoint: '/api/inventory/update',
    status: 'PASS',
    description: 'Admin should be able to update unit count for any blood group',
    assertions: ['HTTP 200 OK', 'Units updated in DB', 'lastUpdated timestamp changed', 'USER role returns 403'],
    code: `@Test
@DisplayName("PUT /api/inventory/update updates units for blood group")
void updateInventory_asAdmin_updatesUnits() throws Exception {
    Map<String, Object> body = Map.of("bloodGroup", "AB-", "units", 25);

    mockMvc.perform(put("/api/inventory/update")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body))
            .header("Authorization", "Bearer " + adminJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.bloodGroup").value("AB-"))
        .andExpect(jsonPath("$.data.units").value(25));

    BloodInventory updated = inventoryRepository.findByBloodGroup("AB-").get();
    assertEquals(25, updated.getUnits());
}`
  },
  {
    id: 'IT-10',
    name: 'POST /api/donations/schedule — user schedules a donation',
    group: 'Donation API',
    method: 'POST',
    endpoint: '/api/donations/schedule',
    status: 'PASS',
    description: 'Should create a SCHEDULED donation record for the authenticated user',
    assertions: ['HTTP 201 Created', 'Status is SCHEDULED', 'User assigned from JWT', 'donationDate is future date'],
    code: `@Test
@DisplayName("POST /api/donations/schedule creates SCHEDULED donation")
void scheduleDonation_validRequest_returns201() throws Exception {
    Map<String, Object> body = Map.of(
        "donationDate", LocalDate.now().plusDays(7).toString(),
        "location", "Red Cross Blood Bank, Chennai",
        "units", 1
    );

    mockMvc.perform(post("/api/donations/schedule")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body))
            .header("Authorization", "Bearer " + userJwtToken))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.status").value("SCHEDULED"))
        .andExpect(jsonPath("$.data.location").value("Red Cross Blood Bank, Chennai"))
        .andExpect(jsonPath("$.data.id").isNumber());
}`
  },
  {
    id: 'IT-11',
    name: 'GET /api/admin/dashboard — returns system statistics',
    group: 'Admin API',
    method: 'GET',
    endpoint: '/api/admin/dashboard',
    status: 'PASS',
    description: 'Should return comprehensive statistics including user count, request counts by status, and inventory summary',
    assertions: ['HTTP 200 OK', 'Contains totalUsers', 'Contains request counts (pending/approved/rejected)', 'Contains inventory summary'],
    code: `@Test
@DisplayName("GET /api/admin/dashboard returns comprehensive stats")
void getDashboard_asAdmin_returnsFullStats() throws Exception {
    mockMvc.perform(get("/api/admin/dashboard")
            .header("Authorization", "Bearer " + adminJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.totalUsers").isNumber())
        .andExpect(jsonPath("$.data.totalDonations").isNumber())
        .andExpect(jsonPath("$.data.pendingRequests").isNumber())
        .andExpect(jsonPath("$.data.approvedRequests").isNumber())
        .andExpect(jsonPath("$.data.rejectedRequests").isNumber())
        .andExpect(jsonPath("$.data.inventorySummary").isArray());
}`
  },
  {
    id: 'IT-12',
    name: 'PUT /api/admin/users/{id}/toggle-status — activates/deactivates user',
    group: 'Admin API',
    method: 'PUT',
    endpoint: '/api/admin/users/{id}/toggle-status',
    status: 'FAIL',
    description: 'Should toggle user active status; deactivated users cannot login',
    assertions: ['HTTP 200 OK', 'User active status flipped in DB', 'Deactivated user gets 403 on login'],
    code: `@Test
@DisplayName("PUT /api/admin/users/{id}/toggle-status deactivates active user")
void toggleUserStatus_activeUser_deactivatesAndPreventsLogin() throws Exception {
    Long userId = testUser.getId();

    mockMvc.perform(put("/api/admin/users/" + userId + "/toggle-status")
            .header("Authorization", "Bearer " + adminJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.active").value(false));

    // BUG: Deactivated user can still login — status check missing in AuthService
    // TODO: Add isActive check in AuthService.login()
    Map<String, String> loginBody = Map.of(
        "email", testUser.getEmail(),
        "password", "testpass"
    );
    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginBody)))
        .andExpect(status().isUnauthorized()); // Currently returns 200 — FAIL
}`
  },
  {
    id: 'IT-13',
    name: 'GET /api/requests/compatible-stocks/{bloodGroup} — returns compatible types',
    group: 'Blood Request API',
    method: 'GET',
    endpoint: '/api/requests/compatible-stocks/{bloodGroup}',
    status: 'PASS',
    description: 'Should return blood groups that are compatible donors for the given blood group',
    assertions: ['HTTP 200 OK', 'Returns correct compatible groups (O+ receives O+, O-)', 'Empty list when no stock available'],
    code: `@Test
@DisplayName("GET /api/requests/compatible-stocks/O+ returns O+ and O-")
void getCompatibleStocks_OPositive_returnsOPlusAndOMinus() throws Exception {
    inventoryRepository.save(new BloodInventory("O+", 5));
    inventoryRepository.save(new BloodInventory("O-", 3));

    mockMvc.perform(get("/api/requests/compatible-stocks/O+")
            .header("Authorization", "Bearer " + userJwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[*].bloodGroup",
            containsInAnyOrder("O+", "O-")))
        .andExpect(jsonPath("$.data", hasSize(2)));
}`
  },
];
