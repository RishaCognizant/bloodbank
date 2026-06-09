package com.bloodbank.service;

import com.bloodbank.dto.DonationRecordDTO;
import com.bloodbank.model.DonationRecord;
import com.bloodbank.model.DonationStatus;
import com.bloodbank.model.User;
import com.bloodbank.repository.DonationRecordRepository;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    @Autowired private DonationRecordRepository donationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;
    @Autowired private BloodInventoryService inventoryService;

    public DonationRecord scheduleDonation(User user, DonationRecordDTO dto) {
        DonationRecord record = DonationRecord.builder()
                .user(user)
                .bloodGroup(dto.getBloodGroup())
                .units(dto.getUnits())
                .donationDate(dto.getDonationDate())
                .location(dto.getLocation())
                .notes(dto.getNotes())
                .status(DonationStatus.SCHEDULED)
                .build();
        return donationRepository.save(record);
    }

    public DonationRecord adminAddDonation(DonationRecordDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        DonationRecord record = DonationRecord.builder()
                .user(user)
                .bloodGroup(dto.getBloodGroup())
                .units(dto.getUnits())
                .donationDate(dto.getDonationDate())
                .location(dto.getLocation())
                .notes(dto.getNotes())
                .status(DonationStatus.COMPLETED)
                .build();
        DonationRecord saved = donationRepository.save(record);
        inventoryService.addUnits(dto.getBloodGroup(), dto.getUnits());
        emailService.sendDonationConfirmation(saved);
        return saved;
    }

    public DonationRecord completeDonation(Long id) {
        DonationRecord record = getById(id);
        record.setStatus(DonationStatus.COMPLETED);
        DonationRecord saved = donationRepository.save(record);
        inventoryService.addUnits(saved.getBloodGroup(), saved.getUnits());
        emailService.sendDonationConfirmation(saved);
        return saved;
    }

    public DonationRecord cancelDonation(Long id) {
        DonationRecord record = getById(id);
        record.setStatus(DonationStatus.CANCELLED);
        return donationRepository.save(record);
    }

    public List<DonationRecord> getAllDonations() {
        return donationRepository.findAllByOrderByDonationDateDesc();
    }

    public List<DonationRecord> getUserDonations(User user) {
        return donationRepository.findByUserOrderByDonationDateDesc(user);
    }

    public DonationRecord getById(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + id));
    }
}
