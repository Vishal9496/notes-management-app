package com.vishal.studentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private String name;
    private String email;

    public static AuthResponse of(String token, String name, String email) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .name(name)
                .email(email)
                .build();
    }
}