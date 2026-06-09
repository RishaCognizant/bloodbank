package com.bloodbank.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private int units;

    private String purpose;
    private String hospital;
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    @Builder.Default
    private boolean emergency = false;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @CreationTimestamp
    private LocalDateTime requestDate;

    private LocalDateTime approvedDate;

    @Column(length = 500)
    private String adminMessage;
}
