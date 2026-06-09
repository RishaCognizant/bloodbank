package com.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String bloodGroup;

    public JwtResponse(String token, Long id, String firstName, String lastName,
                       String email, String role, String bloodGroup) {
        this.token = token;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.bloodGroup = bloodGroup;
    }
}
