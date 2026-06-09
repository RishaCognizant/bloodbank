package com.bloodbank.service;

import com.bloodbank.model.User;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public User updateProfile(Long id, User updates) {
        User user = getUserById(id);
        user.setFirstName(updates.getFirstName());
        user.setLastName(updates.getLastName());
        user.setPhone(updates.getPhone());
        user.setBloodGroup(updates.getBloodGroup());
        user.setAddress(updates.getAddress());
        user.setCity(updates.getCity());
        return userRepository.save(user);
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
