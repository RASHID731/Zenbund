package com.zenbund.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for JWT token operations.
 * Handles token generation, validation, and extraction of claims.
 */
@Component
public class JwtUtil {

    // Secret key loaded from application.properties
    // Should be at least 256 bits (32 characters) for HS256 algorithm
    @Value("${jwt.secret}")
    private String secret;

    // Token expiration time: 24 hours in milliseconds
    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Generate JWT token for a user.
     *
     * @param userDetails Spring Security UserDetails object (our User entity)
     * @return JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Add custom claims if needed (e.g., user ID, role)
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Create JWT token with claims and subject.
     *
     * @param claims Additional data to include in token
     * @param subject User identifier (email in our case)
     * @return Signed JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)                              // Custom claims
                .subject(subject)                            // User email
                .issuedAt(now)                               // Token creation time
                .expiration(expiryDate)                      // Token expiration time
                .signWith(getSigningKey())                   // Sign with secret key
                .compact();                                   // Build the token
    }

    /**
     * Extract username (email) from JWT token.
     *
     * @param token JWT token string
     * @return Username (email)
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract expiration date from JWT token.
     *
     * @param token JWT token string
     * @return Expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract a specific claim from JWT token.
     *
     * @param token JWT token string
     * @param claimsResolver Function to extract specific claim
     * @return Extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from JWT token.
     * This is where token validation happens - if token is invalid or expired,
     * an exception will be thrown.
     *
     * @param token JWT token string
     * @return All claims from the token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())                 // Verify signature
                .build()
                .parseSignedClaims(token)                    // Parse and validate
                .getPayload();                                // Get claims
    }

    /**
     * Check if token has expired.
     *
     * @param token JWT token string
     * @return true if expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validate JWT token.
     * Token is valid if:
     * 1. Username in token matches the UserDetails username
     * 2. Token has not expired
     *
     * @param token JWT token string
     * @param userDetails User details to validate against
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Get signing key from secret string.
     * Converts the secret string into a SecretKey object for HMAC-SHA256.
     *
     * @return SecretKey for signing/verifying tokens
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
