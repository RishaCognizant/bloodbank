package com.bloodbank.service;
 
import com.bloodbank.model.BloodInventory;
import com.bloodbank.model.BloodRequest;
import com.bloodbank.model.DonationRecord;
import com.bloodbank.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
 
import jakarta.mail.internet.MimeMessage;
 
@Service
public class EmailService {
 
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
 
    @Autowired
    private JavaMailSender mailSender;
 
    @Value("${spring.mail.from}")
    private String fromEmail;
 
    @Value("${app.frontend.url}")
    private String frontendUrl;
 
    //new method to send OTP email
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Verify Your Email – Blood Bank Management System";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🩸 Email Verification</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Hello,</p>
                <p>Thank you for starting your registration with the Blood Bank Management System. Please use the following One-Time Password (OTP) to verify your email address:</p>
               
                <div style="text-align:center;margin:40px 0">
                  <span style="background:#f9f9f9;border:2px dashed #e74c3c;padding:15px 30px;font-size:32px;font-weight:bold;letter-spacing:5px;color:#c0392b;border-radius:5px">
                    %s
                  </span>
                </div>
               
                <p>This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:30px 0">
                <p style="color:#888;font-size:13px;text-align:center">Helping save lives through blood donation.</p>
              </div>
            </div>
            """.formatted(otp);
           
        sendHtmlEmail(toEmail, subject, html);
    }
   
    @Async
    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to Blood Bank Management System!";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:30px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🩸 Blood Bank</h1>
                <p style="color:rgba(255,255,255,.9);margin:8px 0 0">Saving Lives Together</p>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <h2 style="color:#c0392b">Welcome, %s!</h2>
                <p>Your account has been successfully created. You can now:</p>
                <ul>
                  <li>Request blood for patients in need</li>
                  <li>Register as a blood donor</li>
                  <li>Track your donation history</li>
                  <li>Manage your profile</li>
                </ul>
                <div style="text-align:center;margin:30px 0">
                  <a href="%s/login" style="background:#e74c3c;color:white;padding:12px 30px;border-radius:5px;text-decoration:none;font-weight:bold">Login to Your Account</a>
                </div>
                <p style="color:#888;font-size:13px">If you need help, contact us at support@bloodbank.com</p>
              </div>
              <p style="text-align:center;color:#aaa;font-size:12px;margin-top:15px">© 2024 Blood Bank Management System</p>
            </div>
            """.formatted(user.getFirstName(), frontendUrl);
        sendHtmlEmail(user.getEmail(), subject, html);
    }
 
    @Async
    public void sendBloodRequestConfirmation(BloodRequest request) {
        String subject = "Blood Request Submitted – #" + request.getId();
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🩸 Blood Request Submitted</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear <strong>%s</strong>,</p>
                <p>Your blood request has been submitted and is under review by our team.</p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Request ID</strong></td><td style="padding:10px;border:1px solid #ddd">#%d</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Patient Name</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Units Required</strong></td><td style="padding:10px;border:1px solid #ddd">%d</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Hospital</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Status</strong></td><td style="padding:10px;border:1px solid #ddd"><span style="color:orange;font-weight:bold">PENDING</span></td></tr>
                </table>
                <p>You will be notified once your request is reviewed. Thank you for trusting us.</p>
              </div>
            </div>
            """.formatted(request.getUser().getFirstName(), request.getId(),
                request.getPatientName(), request.getBloodGroup(),
                request.getUnits(), request.getHospital());
        sendHtmlEmail(request.getUser().getEmail(), subject, html);
    }
 
    @Async
    public void sendRequestApproved(BloodRequest request) {
        String subject = "Blood Request Approved ✅ – #" + request.getId();
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#27ae60,#2ecc71);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">✅ Request Approved!</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear <strong>%s</strong>,</p>
                <p>Great news! Your blood request <strong>#%d</strong> has been <strong style="color:#27ae60">APPROVED</strong>.</p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#eafaf1"><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Units</strong></td><td style="padding:10px;border:1px solid #ddd">%d</td></tr>
                  <tr style="background:#eafaf1"><td style="padding:10px;border:1px solid #ddd"><strong>Hospital</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                </table>
                %s
                <p>Please visit the blood bank with the request ID to collect the blood. Thank you!</p>
              </div>
            </div>
            """.formatted(request.getUser().getFirstName(), request.getId(),
                request.getBloodGroup(), request.getUnits(), request.getHospital(),
                request.getAdminMessage() != null ? "<p><strong>Admin Message:</strong> " + request.getAdminMessage() + "</p>" : "");
        sendHtmlEmail(request.getUser().getEmail(), subject, html);
    }
 
    @Async
    public void sendRequestRejected(BloodRequest request) {
        String subject = "Blood Request Status Update – #" + request.getId();
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#7f8c8d,#95a5a6);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">Request Update</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear <strong>%s</strong>,</p>
                <p>We regret to inform you that your blood request <strong>#%d</strong> for <strong>%s (%s)</strong> could not be fulfilled at this time.</p>
                %s
                <p>Please contact us or visit the blood bank for alternative arrangements. We apologize for any inconvenience.</p>
                <p style="color:#888;font-size:13px">Blood Bank Team | support@bloodbank.com</p>
              </div>
            </div>
            """.formatted(request.getUser().getFirstName(), request.getId(),
                request.getPatientName(), request.getBloodGroup(),
                request.getAdminMessage() != null ? "<p><strong>Reason:</strong> " + request.getAdminMessage() + "</p>" : "");
        sendHtmlEmail(request.getUser().getEmail(), subject, html);
    }
 
    @Async
    public void sendDonationConfirmation(DonationRecord donation) {
        String subject = "Thank You for Your Donation! 🩸";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🩸 Thank You, Hero!</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear <strong>%s</strong>,</p>
                <p>Your blood donation has been recorded. You are a hero — your donation can save up to <strong>3 lives</strong>!</p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Units Donated</strong></td><td style="padding:10px;border:1px solid #ddd">%d</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Date</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Location</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                </table>
                <p>Remember: You can donate blood again after 56 days. Stay hydrated and take care of yourself!</p>
              </div>
            </div>
            """.formatted(donation.getUser().getFirstName(), donation.getBloodGroup(),
                donation.getUnits(), donation.getDonationDate(), donation.getLocation());
        sendHtmlEmail(donation.getUser().getEmail(), subject, html);
    }
 
    @Async
    public void sendUrgentRequestAlert(String adminEmail, BloodRequest request) {
        String subject = "🚨 URGENT Blood Request – #" + request.getId();
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🚨 URGENT REQUEST</h1>
                <p style="color:rgba(255,255,255,.9);margin:8px 0 0">Must be actioned within 24 hours</p>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear Admin,</p>
                <p>An <strong style="color:#c0392b">URGENT</strong> blood request has been submitted.
                  Please review it within <strong>24 hours</strong>.
                </p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Request ID</strong></td><td style="padding:10px;border:1px solid #ddd">#%d</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Requested By</strong></td><td style="padding:10px;border:1px solid #ddd">%s %s (%s)</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Patient</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Units</strong></td><td style="padding:10px;border:1px solid #ddd">%d</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Hospital</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Contact</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                </table>
                <div style="text-align:center;margin:25px 0">
                  <a href="%s/admin/requests" style="background:#c0392b;color:#fff;padding:12px 28px;border-radius:5px;text-decoration:none;font-weight:bold">Review Now</a>
                </div>
                <p style="color:#888;font-size:13px;text-align:center">Please act on this request as soon as possible.</p>
              </div>
            </div>
            """.formatted(
                request.getId(),
                request.getUser().getFirstName(), request.getUser().getLastName(), request.getUser().getEmail(),
                request.getPatientName(), request.getBloodGroup(), request.getUnits(),
                request.getHospital(),
                request.getContactPhone() != null ? request.getContactPhone() : "—",
                frontendUrl);
        sendHtmlEmail(adminEmail, subject, html);
    }

    @Async
    public void sendLowInventoryAlert(String adminEmail, BloodInventory inventory) {
        String subject = "⚠️ Low Blood Inventory Alert: " + inventory.getBloodGroup();
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#e67e22,#f39c12);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">⚠️ Low Inventory Alert</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear Admin,</p>
                <p>The blood inventory for <strong>%s</strong> is critically low.</p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#fff3e0"><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Current Units</strong></td><td style="padding:10px;border:1px solid #ddd"><span style="color:red;font-weight:bold">%d</span></td></tr>
                </table>
                <p>Please arrange for blood donation camps or contact donors immediately.</p>
              </div>
            </div>
            """.formatted(inventory.getBloodGroup(), inventory.getBloodGroup(), inventory.getUnits());
        sendHtmlEmail(adminEmail, subject, html);
    }
 
    @Async
    public void sendDonorCallToAction(com.bloodbank.model.User donor, com.bloodbank.model.BloodRequest request) {
        String subject = "🩸 Urgent Blood Donation Needed – " + request.getBloodGroup();
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🩸 Urgent Donation Needed</h1>
                <p style="color:rgba(255,255,255,.9);margin:8px 0 0">Your blood type can save a life today</p>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear <strong>%s</strong>,</p>
                <p>A patient urgently needs <strong>%s</strong> blood and our inventory is currently insufficient. Your blood type is compatible and your donation could be life-saving.</p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group Needed</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Your Blood Group</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr style="background:#ffeaea"><td style="padding:10px;border:1px solid #ddd"><strong>Units Required</strong></td><td style="padding:10px;border:1px solid #ddd">%d</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Hospital</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                </table>
                <p>If you are willing and able to donate, please visit the blood bank or contact us as soon as possible.</p>
                <div style="text-align:center;margin:25px 0">
                  <a href="%s" style="background:#c0392b;color:#fff;padding:12px 28px;border-radius:5px;text-decoration:none;font-weight:bold">Visit Blood Bank Portal</a>
                </div>
                <p style="color:#888;font-size:13px;text-align:center">Thank you for being a hero. Every donation saves up to 3 lives.</p>
              </div>
            </div>
            """.formatted(
                donor.getFirstName(),
                request.getBloodGroup(), request.getBloodGroup(),
                donor.getBloodGroup(),
                request.getUnits(), request.getHospital(),
                frontendUrl);
        sendHtmlEmail(donor.getEmail(), subject, html);
    }

    @Async
    public void sendAdminNoStockAlert(String adminEmail, com.bloodbank.model.BloodRequest request, int donorsContacted) {
        String subject = "⚠️ Insufficient Stock – Blood Request #" + request.getId() + " Cannot Be Approved";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#e67e22,#f39c12);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">⚠️ Insufficient Blood Stock</h1>
                <p style="color:rgba(255,255,255,.9);margin:8px 0 0">Action required</p>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear Admin,</p>
                <p>Blood request <strong>#%d</strong> could <strong style="color:#c0392b">not be approved</strong> because neither the exact nor any compatible blood group has sufficient stock.</p>
                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#fff3e0"><td style="padding:10px;border:1px solid #ddd"><strong>Request ID</strong></td><td style="padding:10px;border:1px solid #ddd">#%d</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Patient</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr style="background:#fff3e0"><td style="padding:10px;border:1px solid #ddd"><strong>Blood Group Needed</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Units Required</strong></td><td style="padding:10px;border:1px solid #ddd">%d</td></tr>
                  <tr style="background:#fff3e0"><td style="padding:10px;border:1px solid #ddd"><strong>Hospital</strong></td><td style="padding:10px;border:1px solid #ddd">%s</td></tr>
                  <tr><td style="padding:10px;border:1px solid #ddd"><strong>Compatible Donors Notified</strong></td><td style="padding:10px;border:1px solid #ddd"><strong style="color:#27ae60">%d donor(s)</strong> emailed</td></tr>
                </table>
                <p>All registered donors with a compatible blood group have been emailed asking if they can donate. You may now:</p>
                <ul>
                  <li>Wait for donors to respond and then re-approve once stock is updated</li>
                  <li>Reject / cancel the request and inform the requester</li>
                </ul>
                <div style="text-align:center;margin:25px 0">
                  <a href="%s/admin/requests" style="background:#e67e22;color:#fff;padding:12px 28px;border-radius:5px;text-decoration:none;font-weight:bold">Manage Requests</a>
                </div>
                <p style="color:#888;font-size:13px;text-align:center">Blood Bank Management System</p>
              </div>
            </div>
            """.formatted(
                request.getId(), request.getId(),
                request.getPatientName(), request.getBloodGroup(),
                request.getUnits(), request.getHospital(),
                donorsContacted, frontendUrl);
        sendHtmlEmail(adminEmail, subject, html);
    }

    /**
     * Send approval email when a different (compatible) blood group is used instead of the requested one.
     * Includes explanation of blood compatibility and the admin's reason.
     */
    @Async
    public void sendRequestApprovedWithDifferentBlood(BloodRequest request, String usedBloodGroup) {
        String subject = "Blood Request Approved ✅ – #" + request.getId() + " (Compatible Blood Used)";
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#27ae60,#2ecc71);padding:25px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">✅ Request Approved!</h1>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px">
                <p>Dear <strong>%s</strong>,</p>
                <p>Great news! Your blood request <strong>#%d</strong> has been <strong style="color:#27ae60">APPROVED</strong>.</p>
                
                <div style="background:#e3f2fd;border:1px solid #90caf9;border-radius:8px;padding:16px;margin:20px 0">
                  <p style="margin:0 0 10px;color:#1565c0;font-weight:bold">ℹ️ Important Information About Your Blood</p>
                  <p style="margin:0;color:#333;font-size:14px">
                    Your request was for blood group <strong style="color:#c62828">%s</strong>, but we have provided 
                    <strong style="color:#27ae60">%s</strong> instead. This is a <strong>medically compatible</strong> 
                    blood type that is safe and appropriate for the patient.
                  </p>
                </div>

                <table style="width:100%%;border-collapse:collapse;margin:20px 0">
                  <tr style="background:#eafaf1">
                    <td style="padding:10px;border:1px solid #ddd"><strong>Requested Blood Group</strong></td>
                    <td style="padding:10px;border:1px solid #ddd">%s</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #ddd"><strong>Blood Group Provided</strong></td>
                    <td style="padding:10px;border:1px solid #ddd"><strong style="color:#27ae60">%s</strong> (compatible)</td>
                  </tr>
                  <tr style="background:#eafaf1">
                    <td style="padding:10px;border:1px solid #ddd"><strong>Units</strong></td>
                    <td style="padding:10px;border:1px solid #ddd">%d</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #ddd"><strong>Hospital</strong></td>
                    <td style="padding:10px;border:1px solid #ddd">%s</td>
                  </tr>
                </table>
                %s
                <p>Please visit the blood bank with the request ID to collect the blood. If you have any questions about blood compatibility, please don't hesitate to contact us.</p>
                <p style="color:#888;font-size:13px">Blood Bank Team | support@bloodbank.com</p>
              </div>
            </div>
            """.formatted(
                request.getUser().getFirstName(), 
                request.getId(),
                request.getBloodGroup(), 
                usedBloodGroup,
                request.getBloodGroup(),
                usedBloodGroup,
                request.getUnits(), 
                request.getHospital(),
                request.getAdminMessage() != null ? "<p><strong>Admin Message:</strong> " + request.getAdminMessage() + "</p>" : "");
        sendHtmlEmail(request.getUser().getEmail(), subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}