package com.books.exchange.security;

import com.books.exchange.entities.User;
import com.books.exchange.repositories.UserRepo;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@ConditionalOnProperty(name = "spring.security.oauth2.client.registration.google.client-id")
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Value("${app.frontend.url:http://localhost:5175}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String provider = oauthToken.getAuthorizedClientRegistrationId();

        String email = extractEmail(oAuth2User, provider);
        String name = extractName(oAuth2User, provider);

        if (email == null) {
            String errorUrl = frontendUrl + "/login?error=" + URLEncoder.encode("Could not get email from " + provider, StandardCharsets.UTF_8);
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
            return;
        }

        // Find or create user
        User user = userRepo.findByEmail(email).orElseGet(() -> createUser(email, name, provider));

        // Generate JWT token using UserDetails
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        // Redirect to frontend with token
        String redirectUrl = frontendUrl + "/oauth/callback?token=" + token
            + "&userId=" + user.getId()
            + "&name=" + URLEncoder.encode(user.getName(), StandardCharsets.UTF_8)
            + "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private String extractEmail(OAuth2User oAuth2User, String provider) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        if ("google".equals(provider)) {
            return (String) attributes.get("email");
        } else if ("github".equals(provider)) {
            return (String) attributes.get("email");
        }
        return null;
    }

    private String extractName(OAuth2User oAuth2User, String provider) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        if ("google".equals(provider)) {
            return (String) attributes.get("name");
        } else if ("github".equals(provider)) {
            String name = (String) attributes.get("name");
            return name != null ? name : (String) attributes.get("login");
        }
        return "User";
    }

    private User createUser(String email, String name, String provider) {
        User user = User.builder()
                .email(email)
                .name(name != null ? name : email.split("@")[0])
                .password(UUID.randomUUID().toString()) // Random password for OAuth users
                .oauthProvider(provider)
                .createdAt(LocalDateTime.now())
                .build();
        return userRepo.save(user);
    }
}

