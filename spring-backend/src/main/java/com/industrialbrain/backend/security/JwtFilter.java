package com.industrialbrain.backend.security;

import java.io.IOException;
import java.util.List;

import com.industrialbrain.backend.entity.User;
import com.industrialbrain.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("\n==========================================");
        System.out.println("Request : " + request.getMethod() + " " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");


        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("No Bearer token found.");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            boolean valid = jwtService.validateToken(token);

            System.out.println("Token Valid : " + valid);

            if (!valid) {
                System.out.println("JWT validation failed.");
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtService.extractEmail(token);


            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {

                System.out.println("User NOT found in database.");
                filterChain.doFilter(request, response);
                return;
            }


            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);


        } catch (Exception e) {

            System.out.println("JWT Exception:");
            e.printStackTrace();

        }

        filterChain.doFilter(request, response);
    }
}