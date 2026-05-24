package com.hyundai.dms.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Idempotency filter for POST requests.
 * Prevents duplicate processing of the same request using Idempotency-Key header.
 * Cached responses expire after 24 hours.
 */
@Slf4j
@Component
public class IdempotencyFilter extends OncePerRequestFilter {

    private static final String IDEMPOTENCY_KEY_HEADER = "Idempotency-Key";
    private static final long CACHE_EXPIRY_MS = TimeUnit.HOURS.toMillis(24);
    
    // In-memory cache: idempotencyKey -> CachedResponse
    // For production, use Redis or distributed cache
    private final ConcurrentHashMap<String, CachedResponse> cache = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Only apply to POST requests
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String idempotencyKey = request.getHeader(IDEMPOTENCY_KEY_HEADER);
        
        // If no idempotency key, proceed normally
        if (!StringUtils.hasText(idempotencyKey)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Clean expired entries
        cleanExpiredEntries();

        // Check if we've seen this key before
        CachedResponse cachedResponse = cache.get(idempotencyKey);
        if (cachedResponse != null && !cachedResponse.isExpired()) {
            log.info("Idempotent request detected: {} - returning cached response", idempotencyKey);
            response.setStatus(cachedResponse.status);
            response.setContentType(cachedResponse.contentType);
            response.getWriter().write(cachedResponse.body);
            return;
        }

        // Wrap request and response to cache content
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);
        
        // Process the request
        filterChain.doFilter(request, responseWrapper);

        // Cache the response for successful operations (2xx status codes)
        int status = responseWrapper.getStatus();
        if (status >= 200 && status < 300) {
            String responseBody = new String(responseWrapper.getContentAsByteArray(), responseWrapper.getCharacterEncoding());
            String contentType = responseWrapper.getContentType();
            
            cache.put(idempotencyKey, new CachedResponse(status, contentType, responseBody, System.currentTimeMillis()));
            log.debug("Cached response for idempotency key: {}", idempotencyKey);
        }

        // Copy cached content to actual response
        responseWrapper.copyBodyToResponse();
    }

    private void cleanExpiredEntries() {
        long now = System.currentTimeMillis();
        cache.entrySet().removeIf(entry -> entry.getValue().isExpired(now));
    }

    private static class CachedResponse {
        final int status;
        final String contentType;
        final String body;
        final long timestamp;

        CachedResponse(int status, String contentType, String body, long timestamp) {
            this.status = status;
            this.contentType = contentType;
            this.body = body;
            this.timestamp = timestamp;
        }

        boolean isExpired() {
            return isExpired(System.currentTimeMillis());
        }

        boolean isExpired(long now) {
            return (now - timestamp) > CACHE_EXPIRY_MS;
        }
    }
}
