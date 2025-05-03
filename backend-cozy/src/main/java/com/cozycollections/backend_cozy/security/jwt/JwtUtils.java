package com.cozycollections.backend_cozy.security.jwt;


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


import java.lang.reflect.Type;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
//JWT üretmek, doğrulamak ve içinden veri çekmek için yardımcı sınıf.
@Component
public class JwtUtils {
    @Value("${auth.token.jwtSecret}")
    private String jwtSecret;

    @Value("${auth.token.accessExpirationInMils}")
    private String expirationTime;


    public String gerenateAccessTokenForUser(Authentication authentication) {
        String email = authentication.getName();

        List<String> roles = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationTime(expirationTime))
                .signWith(getSignedKey(), SignatureAlgorithm.HS256)
                .compact(); //Token'ı string'e çevirir.


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
            throw new JwtException(e.getMessage());
        }
    }
    public List<String> getRolesFromToken(String token) {
       Object rolesObj = Jwts.parserBuilder()
                .setSigningKey(getSignedKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("roles");

        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(rolesObj,new TypeReference<List<String>>() {});
    }


}
