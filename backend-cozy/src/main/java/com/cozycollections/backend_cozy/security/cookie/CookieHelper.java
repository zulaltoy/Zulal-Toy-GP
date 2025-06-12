package com.cozycollections.backend_cozy.security.cookie;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieHelper {

    @Value("${app.useSecureCookie:false}")
    private boolean useSecureCookie;

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken, long maxAge) {
        if (response == null) {
            throw new IllegalArgumentException("HttpServletResponse cannot be null");
        }
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true); // HttpOnly: JavaScript ile erişilemez, XSS saldırılarına karşı koruma sağlar.
        refreshTokenCookie.setPath("/");//Bu cookie tüm site yolları için geçerli olur (/ tüm path’ler demektir).
        refreshTokenCookie.setMaxAge((int) (maxAge / 1000));
        refreshTokenCookie.setSecure(useSecureCookie);
        String sameSite = useSecureCookie ? "None" : "Lax";  //SameSite tarayıcıların çerezleri 3. parti sitelere gönderip göndermeyeceğini kontrol eder.
        setResponseHeader(response, refreshTokenCookie, sameSite);// Cookie'yi manuel olarak HTTP header’ına eklemek için yardımcı metoda gönderilir.
    }

    private void setResponseHeader(HttpServletResponse response, Cookie refreshTokenCookie, String sameSite) {
        StringBuilder cookieHeader = new StringBuilder();  // Cookie header’ı yazmak için StringBuilder başlatılır.
        cookieHeader.append(refreshTokenCookie.getName()).append("=")  // Cookie başlığı manuel olarak hazırlanır:
                .append(refreshTokenCookie.getValue())
                .append("; HttpOnly; Path=").append(refreshTokenCookie.getPath())
                .append("; Max-Age=").append(refreshTokenCookie.getMaxAge())
                .append(useSecureCookie ? "; Secure" : "")
                .append("; SameSite=").append(sameSite);
        response.setHeader("Set-Cookie", cookieHeader.toString());
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("Names of the cookie found: " + cookie.getName());
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void logCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        System.out.println("Cookies: " + (cookies != null ? Arrays.toString(cookies) : "null"));
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("Cookie name: " + cookie.getName() + ", value: " + cookie.getValue());
            }
        }
    }
}
