package com.cozycollections.backend_cozy.security.jwt;


import com.cozycollections.backend_cozy.security.userDetail.ShopUserDetails;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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

//JWT üretmek, doğrulamak ve içinden veri çekmek için yardımcı sınıf.
@Component
public class JwtUtils {
    @Value("${auth.token.jwtSecret}")
    private String jwtSecret;

    @Value("${auth.token.accessExpirationInMils}")
    private String expirationTime;

    @Value("${auth.token.refreshExpirationInMils}")
    private String refreshExpirationTime;


    public String generateAccessTokenForUser(Authentication authentication) {
        ShopUserDetails userPrincipals = (ShopUserDetails) authentication.getPrincipal();

       List<String> roles = userPrincipals.getAuthorities()
               .stream()
               .map(GrantedAuthority::getAuthority).toList();



        return Jwts.builder()
                .setSubject(userPrincipals.getEmail())
                .claim("id", userPrincipals.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationTime(expirationTime))
                .signWith(getSignedKey(), SignatureAlgorithm.HS256)
                .compact(); //Token'ı string'e çevirir.


    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationTime(refreshExpirationTime))
                .signWith(getSignedKey(),SignatureAlgorithm.HS256)
                .compact();
    }

    private Date calculateExpirationTime(String expirationTime) {
        Long expirationTimeLong = Long.parseLong(expirationTime);
        return new Date(System.currentTimeMillis() + expirationTimeLong);
    }

    private Key getSignedKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)); //Şifrelenmiş anahtarı çözerek Key nesnesi üretir.
    }

    public String getUserNameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignedKey())
                .build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getSignedKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        }catch (JwtException e){
            //throw new JwtException(e.getMessage());
            System.out.println("Invalid JWT token: " + e.getMessage());

            return false;
        }
    }


}
