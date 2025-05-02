package com.cozycollections.backend_cozy.security.jwt;

import com.cozycollections.backend_cozy.security.user.ShopUserDetails;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;


import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {
    @Value("${auth.token.jwtSecret}")
    private String jwtSecret;

    @Value("${auth.token.accessExpirationInMils}")
    private String expirationTime;

    @Value("${auth.token.refreshExpirationInMils}")
    private String refreshExpirationTime;

    public String gerenateAccessTokenForUser(Authentication authentication) {
        ShopUserDetails userPrincipal = (ShopUserDetails) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities()
                .stream().map(GrantedAuthority::getAuthority).toList();

        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("id",userPrincipal.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationTime(expirationTime))
                .signWith(key(), SignatureAlgorithm.HS256).compact();
    }

    private Date calculateExpirationTime(String expirationTime) {
        Long expirationTimeLong = Long.parseLong(expirationTime);
        return new Date(System.currentTimeMillis() + expirationTimeLong);
    }
    private Key key() {return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));}

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email).setIssuedAt(new Date())
                .setExpiration(calculateExpirationTime(refreshExpirationTime))
                .signWith(key(),SignatureAlgorithm.HS256).compact();
    }

    public String getUserNameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try{
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);
            return true;
        }catch (JwtException e){
            throw new JwtException(e.getMessage());
        }
    }


}
