package com.bloodbank.config;

import com.bloodbank.model.*;
import com.bloodbank.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Runs only when app.seed-test-data=true in application.properties.
 * Order(2) ensures it runs after DataInitializer (Order 1).
 */
@Component
@Order(2)
@ConditionalOnProperty(name = "app.seed-test-data", havingValue = "true")
public class TestDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TestDataSeeder.class);

    @Autowired private UserRepository         userRepo;
    @Autowired private BloodInventoryRepository inventoryRepo;
    @Autowired private BloodRequestRepository  requestRepo;
    @Autowired private DonationRecordRepository donationRepo;
    @Autowired private PasswordEncoder         encoder;

    @Override
    public void run(String... args) {
        log.info(">>> Seeding test data...");
        seedUsers();
        seedInventory();
        seedRequests();
        seedDonations();
        log.info(">>> Test data seeded. All user passwords: Test@123");
    }

    // ── Users ────────────────────────────────────────────────────────────────

    private void seedUsers() {
        String pw = encoder.encode("Test@123");

        List<User> users = List.of(
            User.builder()
                .firstName("Ravi").lastName("Kumar")
                .email("ravi@test.com").password(pw)
                .phone("9876543210").bloodGroup("A+")
                .city("Chennai").address("12 Anna Nagar")
                .role(Role.USER).active(true).build(),

            User.builder()
                .firstName("Priya").lastName("Sharma")
                .email("priya@test.com").password(pw)
                .phone("9845012345").bloodGroup("B+")
                .city("Mumbai").address("45 Bandra West")
                .role(Role.USER).active(true).build(),

            User.builder()
                .firstName("Anita").lastName("Singh")
                .email("anita@test.com").password(pw)
                .phone("9911223344").bloodGroup("O+")
                .city("Delhi").address("78 Connaught Place")
                .role(Role.USER).active(true).build(),

            User.builder()
                .firstName("Mohammed").lastName("Ali")
                .email("mohammed@test.com").password(pw)
                .phone("9988776655").bloodGroup("AB+")
                .city("Bangalore").address("34 Koramangala")
                .role(Role.USER).active(true).build(),

            User.builder()
                .firstName("Sunita").lastName("Patel")
                .email("sunita@test.com").password(pw)
                .phone("9123456789").bloodGroup("A-")
                .city("Hyderabad").address("56 Banjara Hills")
                .role(Role.USER).active(true).build(),

            User.builder()
                .firstName("Karthik").lastName("Nair")
                .email("karthik@test.com").password(pw)
                .phone("9000011111").bloodGroup("O-")
                .city("Kochi").address("22 Marine Drive")
                .role(Role.USER).active(false).build()   // inactive user — to test admin toggle
        );

        users.forEach(u -> {
            if (!userRepo.existsByEmail(u.getEmail())) {
                userRepo.save(u);
                log.info("  Created user: {}", u.getEmail());
            }
        });
    }

    // ── Blood Inventory ──────────────────────────────────────────────────────

    private void seedInventory() {
        Map<String, Integer> stock = Map.of(
            "A+",  45,
            "A-",   8,   // low — will trigger alert email
            "B+",  32,
            "B-",   5,   // low
            "AB+", 18,
            "AB-",  3,   // low
            "O+",  60,
            "O-",   7    // low
        );

        stock.forEach((group, units) ->
            inventoryRepo.findByBloodGroup(group).ifPresent(inv -> {
                inv.setUnits(units);
                inventoryRepo.save(inv);
                log.info("  Inventory {} → {} units", group, units);
            })
        );
    }

    // ── Blood Requests ───────────────────────────────────────────────────────

    private void seedRequests() {
        User ravi     = userRepo.findByEmail("ravi@test.com").orElse(null);
        User priya    = userRepo.findByEmail("priya@test.com").orElse(null);
        User anita    = userRepo.findByEmail("anita@test.com").orElse(null);
        User mohammed = userRepo.findByEmail("mohammed@test.com").orElse(null);
        User sunita   = userRepo.findByEmail("sunita@test.com").orElse(null);

        if (ravi == null) return; // users not created yet

        List<BloodRequest> requests = List.of(

            BloodRequest.builder()
                .user(ravi).patientName("Ravi Kumar")
                .bloodGroup("A+").units(2)
                .purpose("Surgery").hospital("Apollo Hospital, Chennai")
                .contactPhone("9876543210")
                .status(RequestStatus.APPROVED)
                .adminMessage("Blood is ready. Visit counter 3 with this request ID.")
                .build(),

            BloodRequest.builder()
                .user(priya).patientName("Rajesh Sharma")
                .bloodGroup("B+").units(3)
                .purpose("Accident").hospital("Fortis Hospital, Mumbai")
                .contactPhone("9845012345")
                .status(RequestStatus.PENDING)
                .build(),

            BloodRequest.builder()
                .user(anita).patientName("Anita Singh")
                .bloodGroup("A+").units(1)
                .purpose("Anemia").hospital("AIIMS, New Delhi")
                .contactPhone("9911223344")
                .status(RequestStatus.REJECTED)
                .adminMessage("Insufficient stock at this time. Please visit in person for alternatives.")
                .build(),

            BloodRequest.builder()
                .user(mohammed).patientName("Fatima Ali")
                .bloodGroup("AB+").units(2)
                .purpose("Cancer Treatment").hospital("Manipal Hospital, Bangalore")
                .contactPhone("9988776655")
                .status(RequestStatus.PENDING)
                .build(),

            BloodRequest.builder()
                .user(sunita).patientName("Deepak Patel")
                .bloodGroup("O+").units(4)
                .purpose("Surgery").hospital("Yashoda Hospital, Hyderabad")
                .contactPhone("9123456789")
                .status(RequestStatus.APPROVED)
                .adminMessage("Approved. Collect between 9 AM – 5 PM on weekdays.")
                .build()
        );

        requests.forEach(r -> {
            requestRepo.save(r);
            log.info("  Request: {} {} → {}", r.getBloodGroup(), r.getUnits() + "u", r.getStatus());
        });
    }

    // ── Donation Records ─────────────────────────────────────────────────────

    private void seedDonations() {
        User ravi     = userRepo.findByEmail("ravi@test.com").orElse(null);
        User priya    = userRepo.findByEmail("priya@test.com").orElse(null);
        User mohammed = userRepo.findByEmail("mohammed@test.com").orElse(null);
        User sunita   = userRepo.findByEmail("sunita@test.com").orElse(null);
        User anita    = userRepo.findByEmail("anita@test.com").orElse(null);

        if (ravi == null) return;

        List<DonationRecord> donations = List.of(

            DonationRecord.builder()
                .user(ravi).bloodGroup("A+").units(1)
                .donationDate(LocalDate.now().minusDays(60))
                .location("Chennai Government Blood Bank")
                .status(DonationStatus.COMPLETED)
                .notes("Regular donor — no issues").build(),

            DonationRecord.builder()
                .user(priya).bloodGroup("B+").units(1)
                .donationDate(LocalDate.now().minusDays(30))
                .location("Mumbai Central Blood Bank")
                .status(DonationStatus.COMPLETED)
                .notes("First-time donor").build(),

            DonationRecord.builder()
                .user(mohammed).bloodGroup("AB+").units(1)
                .donationDate(LocalDate.now().minusDays(10))
                .location("Bangalore Red Cross")
                .status(DonationStatus.COMPLETED).build(),

            DonationRecord.builder()
                .user(sunita).bloodGroup("A-").units(1)
                .donationDate(LocalDate.now().plusDays(5))
                .location("Hyderabad Blood Bank, Tank Bund")
                .status(DonationStatus.SCHEDULED)
                .notes("Appointment confirmed").build(),

            DonationRecord.builder()
                .user(anita).bloodGroup("O+").units(1)
                .donationDate(LocalDate.now().plusDays(2))
                .location("AIIMS Blood Bank, Delhi")
                .status(DonationStatus.SCHEDULED).build()
        );

        donations.forEach(d -> {
            donationRepo.save(d);
            log.info("  Donation: {} {} → {}", d.getUser().getEmail(), d.getBloodGroup(), d.getStatus());
        });
    }
}
