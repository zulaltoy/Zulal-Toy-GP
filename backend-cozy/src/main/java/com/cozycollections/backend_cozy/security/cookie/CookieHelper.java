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

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken,long maxAge){
        if(response ==null){
            throw new IllegalArgumentException("response is null");
        }
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) maxAge/1000);
        refreshTokenCookie.setSecure(useSecureCookie);
        String sameSite = useSecureCookie ? "None" : "Lax";
        setResponseHeader(response,refreshTokenCookie,sameSite);
    }

    private void setResponseHeader(HttpServletResponse response,Cookie refreshTokenCookie,String sameSite) {
        StringBuilder cookieHeader = new StringBuilder();
        cookieHeader.append(refreshTokenCookie.getName()).append("=")
                .append(refreshTokenCookie.getValue())
                .append("; HttpOnly; Path=").append(refreshTokenCookie.getPath())
                .append("; Max-Age=").append(refreshTokenCookie.getMaxAge())
                .append(useSecureCookie ? "; Secure" : "")
                .append("; SameSite=").append(sameSite);
        response.setHeader("Set-Cookie", cookieHeader.toString());
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(cookies != null){
            for(Cookie cookie : cookies){
                System.out.println("Cookie names: " + cookie.getName());
                if("refreshToken".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    public void logCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        System.out.println("Cookies: " + (cookies!= null ? Arrays.toString(cookies) : "null"));
        if(cookies != null){
            for(Cookie cookie : cookies){
                System.out.println("Cookie names: " + cookie.getName() + " value: " + cookie.getValue());
            }
        }
    }
}
