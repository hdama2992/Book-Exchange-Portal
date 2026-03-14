package com.books.exchange.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@bookswap.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5175}")
    private String frontendUrl;

    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("HTML email sent to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String htmlContent = """
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📚 BookSwap</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Reset Your Password</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    <a href="%s" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0;">
                        Reset Password
                    </a>
                    <p style="color: #94a3b8; font-size: 14px;">
                        This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
            </div>
            """.formatted(resetLink);

        sendHtmlEmail(to, "Reset Your BookSwap Password", htmlContent);
    }

    public void sendWelcomeEmail(String to, String name) {
        String htmlContent = """
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📚 BookSwap</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Welcome, %s! 🎉</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        Thanks for joining BookSwap! You're now part of a community of book lovers who share and exchange books.
                    </p>
                    <p style="color: #64748b; line-height: 1.6;">
                        <strong>Get started:</strong><br>
                        📖 Browse available books<br>
                        📝 Publish your own books<br>
                        🤝 Request book exchanges
                    </p>
                    <a href="%s/browse" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0;">
                        Start Browsing
                    </a>
                </div>
            </div>
            """.formatted(name, frontendUrl);

        sendHtmlEmail(to, "Welcome to BookSwap! 📚", htmlContent);
    }

    public void sendRequestNotification(String to, String requesterName, String bookTitle) {
        String htmlContent = """
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📚 BookSwap</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
                    <h2 style="color: #1e293b; margin-top: 0;">New Book Request! 📬</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        <strong>%s</strong> has requested to borrow your book:<br>
                        <em style="color: #1e293b; font-size: 18px;">"%s"</em>
                    </p>
                    <a href="%s/requests" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0;">
                        View Request
                    </a>
                </div>
            </div>
            """.formatted(requesterName, bookTitle, frontendUrl);

        sendHtmlEmail(to, "New Book Request: " + bookTitle, htmlContent);
    }
}

