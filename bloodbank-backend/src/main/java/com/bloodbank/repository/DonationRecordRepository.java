package com.bloodbank.repository;

import com.bloodbank.model.DonationRecord;
import com.bloodbank.model.DonationStatus;
import com.bloodbank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRecordRepository extends JpaRepository<DonationRecord, Long> {
    List<DonationRecord> findByUser(User user);
    List<DonationRecord> findByUserOrderByDonationDateDesc(User user);
    List<DonationRecord> findAllByOrderByDonationDateDesc();
    List<DonationRecord> findByStatus(DonationStatus status);
    long countByStatus(DonationStatus status);
}
