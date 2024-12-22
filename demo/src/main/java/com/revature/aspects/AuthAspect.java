package com.revature.aspects;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthAspect {

    private final HttpSession session;

    public AuthAspect(HttpSession session) {
        this.session = session;
    }

    @Before("@annotation(com.revature.aspects.AdminOnly)")
    public void checkAdminAccess(JoinPoint joinPoint) {
        // Retrieve session attributes
        String username = (String) session.getAttribute("username");
        String role = (String) session.getAttribute("role");

        // Check if the user is logged in
        if (username == null || role == null) {
            throw new SecurityException("Access Denied: You must be logged in to perform this action.");
        }

        // Check if the user has admin privileges
        if (!"manager".equalsIgnoreCase(role)) {
            throw new SecurityException("Access Denied: Only administrators can perform this action.");
        }

        System.out.println("Access granted to admin for method: " + joinPoint.getSignature().getName());
    }




}