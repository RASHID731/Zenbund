package com.zenbund.backend.config;

import com.zenbund.backend.security.JwtAuthenticationEntryPoint;
import com.zenbund.backend.security.JwtAuthenticationFilter;
import com.zenbund.backend.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for JWT-based authentication.
 * This is the heart of the security system - it configures:
 * - Which endpoints require authentication
 * - How authentication works (JWT tokens)
 * - Password hashing (BCrypt)
 * - CORS and CSRF settings
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserService userService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    /**
     * Constructor with @Lazy on UserService to break circular dependency.
     * Circular dependency: SecurityConfig → UserService → AuthenticationManager → SecurityConfig
     */
    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            @Lazy UserService userService,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userService = userService;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    /**
     * Main security configuration.
     * Defines which endpoints are public vs protected.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (Cross-Site Request Forgery) protection
                // Safe for JWT because tokens are in headers, not cookies
                // Cookies are vulnerable to CSRF, but Authorization headers are not
                .csrf(csrf -> csrf.disable())

                // Configure which endpoints require authentication
                .authorizeHttpRequests(auth -> auth
                        // PUBLIC endpoints - anyone can access without authentication
                        .requestMatchers(
                                "/api/auth/register",      // Registration
                                "/api/auth/login",         // Login
                                "/api/categories/**",      // Categories (for now)
                                "/api/offers/**",          // Offers (for now)
                                "/api/threads/**",         // Threads (for now)
                                "/api/thread-members/**",  // Thread memberships (for now)
                                "/ws/**"                   // WebSocket upgrade (JWT auth handled by STOMP interceptor)
                        ).permitAll()

                        // ALL OTHER endpoints require authentication
                        // In the future, you can add specific rules:
                        // .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )

                // Session management: STATELESS
                // This means Spring Security won't create HTTP sessions
                // Perfect for JWT - each request is independent
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Exception handling: Return 401 instead of 403 for unauthorized requests
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )

                // Set custom authentication provider (uses BCrypt)
                .authenticationProvider(authenticationProvider())

                // Add JWT filter BEFORE UsernamePasswordAuthenticationFilter
                // This means JWT filter runs first to check for tokens
                // Flow: Request → JWT Filter → Spring Security → Controller
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Password encoder bean.
     * Uses BCrypt hashing algorithm with strength 12.
     * Strength 12 = 2^12 = 4096 iterations (good balance of security and speed)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Authentication provider.
     * Tells Spring Security how to authenticate users:
     * 1. Load user from database (via UserService)
     * 2. Compare passwords using BCrypt
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);  // How to load users
        provider.setPasswordEncoder(passwordEncoder());  // How to check passwords
        return provider;
    }

    /**
     * Authentication manager bean.
     * Used by UserService to authenticate login requests.
     * Spring provides this automatically via AuthenticationConfiguration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
