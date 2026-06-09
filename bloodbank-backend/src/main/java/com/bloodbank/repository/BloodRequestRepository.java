package com.bloodbank.repository;

import com.bloodbank.model.BloodRequest;
import com.bloodbank.model.RequestStatus;
import com.bloodbank.model.Severity;
import com.bloodbank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByUser(User user);
    List<BloodRequest> findByStatus(RequestStatus status);
    List<BloodRequest> findByUserOrderByRequestDateDesc(User user);
    List<BloodRequest> findAllByOrderByRequestDateDesc();
    long countByStatus(RequestStatus status);
    long countByEmergency(boolean emergency);
    long countBySeverity(Severity severity);

    @Query("SELECT b.bloodGroup, COUNT(b) FROM BloodRequest b GROUP BY b.bloodGroup")
    List<Object[]> countByBloodGroup();

    // URGENT first, then MEDIUM, then NORMAL, then legacy rows without severity; latest first within each tier
    @Query("SELECT b FROM BloodRequest b ORDER BY " +
            "CASE b.severity " +
            "  WHEN com.bloodbank.model.Severity.URGENT THEN 1 " +
            "  WHEN com.bloodbank.model.Severity.MEDIUM THEN 2 " +
            "  WHEN com.bloodbank.model.Severity.NORMAL THEN 3 " +
            "  ELSE 4 END ASC, " +
            "b.requestDate DESC")
    List<BloodRequest> findAllPrioritized();

    @Query("SELECT b FROM BloodRequest b WHERE b.severity = :severity ORDER BY b.requestDate DESC")
    List<BloodRequest> findBySeverityOrderByRequestDateDesc(Severity severity);
}
