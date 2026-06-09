package com.bloodbank.service;
 
import com.bloodbank.dto.JwtResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.RegisterRequest;
import com.bloodbank.model.Role;
import com.bloodbank.model.User;
import com.bloodbank.repository.UserRepository;
import com.bloodbank.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
 
@Service
public class AuthService {
 
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private EmailService emailService;
 
    // Temporary storage: Key = Email, Value = OTP Code
    private final java.util.Map<String, String> otpCache = new java.util.concurrent.ConcurrentHashMap<>();
    // Step 1: Generate and Send OTP
    public void sendVerificationOtp(String email) {
    // Check if user already exists before sending OTP
    if (userRepository.existsByEmail(email)) {
        throw new RuntimeException("Email already in use: " + email);
    }
 
    // Generate a 6-digit random code
    String otp = String.format("%06d", new java.util.Random().nextInt(999999));
   
    // Store in our temporary cache
    otpCache.put(email, otp);
 
    // Call your existing EmailService
    emailService.sendOtpEmail(email, otp);
    }
 
// Step 2: Verify the code (Called by Angular when user enters OTP)
    public boolean verifyOtp(String email, String userEnteredOtp) {
    String storedOtp = otpCache.get(email);
    return storedOtp != null && storedOtp.equals(userEnteredOtp);
    }
 
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        String token = jwtUtils.generateToken(user);
        return new JwtResponse(token, user.getId(), user.getFirstName(), user.getLastName(),
                user.getEmail(), user.getRole().name(), user.getBloodGroup());
    }
 
    public User register(RegisterRequest request) {
        if (!otpCache.containsKey(request.getEmail())) {
        throw new RuntimeException("Email verification required before registration.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .bloodGroup(request.getBloodGroup())
                .address(request.getAddress())
                .city(request.getCity())
                .role(Role.USER)
                .active(true)
                .build();
        User saved = userRepository.save(user);
 
        // Cleanup: Remove OTP from cache after successful registration
        otpCache.remove(request.getEmail());
 
        emailService.sendWelcomeEmail(saved);
        return saved;
    }
}
 