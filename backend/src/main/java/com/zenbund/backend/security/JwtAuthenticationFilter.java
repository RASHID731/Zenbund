package com.zenbund.backend.security;

import com.zenbund.backend.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter.
 * Intercepts every HTTP request and validates JWT token if present.
 * Runs once per request (OncePerRequestFilter).
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    /**
     * Constructor with @Lazy on UserService to break circular dependency.
     * Circular dependency: JwtAuthenticationFilter → UserService → SecurityConfig → JwtAuthenticationFilter
     * @Lazy delays UserService initialization until first use.
     */
    public JwtAuthenticationFilter(JwtUtil jwtUtil, @Lazy UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    /**
     * Filter logic executed for every request.
     *
     * Flow:
     * 1. Extract JWT token from Authorization header
     * 2. If token exists, validate it
     * 3. If valid, load user details and set authentication in Spring Security context
     * 4. Continue filter chain (let request reach controller)
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Step 1: Extract JWT token from Authorization header
        // Header format: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        final String authorizationHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        // Check if Authorization header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract token (remove "Bearer " prefix)
            jwt = authorizationHeader.substring(7);

            try {
                // Step 2: Extract email from JWT token
                // If token is invalid or expired, extractUsername() will throw exception
                email = jwtUtil.extractUsername(jwt);
            } catch (JwtException e) {
                // Invalid or expired token - log and continue without authentication
                logger.warn("Invalid JWT token: " + e.getMessage());
            }
        }

        // Step 3: If we have a valid email and user is not already authenticated
        // SecurityContextHolder.getContext().getAuthentication() returns null if not authenticated
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details from database using email
            UserDetails userDetails = userService.loadUserByUsername(email);

            // Validate token against user details
            // Checks: 1) email in token matches user, 2) token not expired
            if (jwtUtil.validateToken(jwt, userDetails)) {

                // Token is valid! Create authentication object
                // This tells Spring Security: "This user is authenticated"
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,  // credentials (we don't need password here)
                                userDetails.getAuthorities()  // user roles/permissions
                        );

                // Add request details (IP address, session ID, etc.)
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set authentication in Spring Security context
                // Now Spring Security knows this user is authenticated!
                // Controllers can access this user via SecurityContextHolder
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // Step 4: Continue with the request
        // Either:
        // - User is now authenticated (if JWT was valid)
        // - User is not authenticated (if no JWT or invalid JWT)
        // The controller or Spring Security config will decide if request is allowed
        filterChain.doFilter(request, response);
    }
}
