package com.vishal.studentmanagement.service;

import com.vishal.studentmanagement.dto.AuthResponse;
import com.vishal.studentmanagement.dto.LoginRequest;
import com.vishal.studentmanagement.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}