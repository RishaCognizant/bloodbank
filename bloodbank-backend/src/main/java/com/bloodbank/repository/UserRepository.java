package com.bloodbank.repository;

import com.bloodbank.model.Role;
import com.bloodbank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByBloodGroup(String bloodGroup);
    long countByRole(Role role);
    long countByActive(boolean active);
}
