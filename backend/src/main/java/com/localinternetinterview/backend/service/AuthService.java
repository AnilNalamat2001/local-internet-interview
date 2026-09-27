package com.localinternetinterview.backend.service;

import com.localinternetinterview.backend.dto.LoginRequest;
import com.localinternetinterview.backend.dto.LoginResponse;
import com.localinternetinterview.backend.dto.RegisterRequest;
import com.localinternetinterview.backend.entity.User;
import com.localinternetinterview.backend.exception.InvalidCredentialsException;
import com.localinternetinterview.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(hashedPassword);

        user.setArea(request.getArea());
        user.setCity(request.getCity());

        User savedUser = userRepository.save(user);

        savedUser.setPassword(null);

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        ));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getArea(),
                user.getCity()
        );
    }
}