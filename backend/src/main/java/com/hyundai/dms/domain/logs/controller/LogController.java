package com.hyundai.dms.domain.logs.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

@Slf4j
@RestController
@RequestMapping("/v1/logs")
@Tag(name = "Log Viewer", description = "Admin-only log viewer")
public class LogController {

    // Resolve absolute path from logging config
    private static final String LOG_FILE       = "logs/dms-application.log";
    private static final String ERROR_LOG_FILE = "logs/dms-error.log";

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(defaultValue = "300") int lines,
            @RequestParam(defaultValue = "application") String type) {

        String filePath = "error".equalsIgnoreCase(type) ? ERROR_LOG_FILE : LOG_FILE;
        List<String> logLines = readLastLines(filePath, lines);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("file", filePath);
        response.put("totalLines", logLines.size());
        response.put("lines", logLines);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> filterLogs(
            @RequestParam(defaultValue = "ERROR") String level,
            @RequestParam(defaultValue = "500") int lines) {

        List<String> all = readLastLines(LOG_FILE, 10000);
        List<String> filtered = all.stream()
                .filter(l -> l.contains(" " + level.toUpperCase() + " "))
                .collect(Collectors.toList());

        int from = Math.max(0, filtered.size() - lines);
        List<String> result = filtered.subList(from, filtered.size());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("level", level.toUpperCase());
        response.put("totalMatched", filtered.size());
        response.put("returned", result.size());
        response.put("lines", result);
        return ResponseEntity.ok(response);
    }

    private List<String> readLastLines(String filePath, int n) {
        // Try multiple charsets to handle any encoding in log files
        for (Charset charset : new Charset[]{StandardCharsets.UTF_8, StandardCharsets.ISO_8859_1, Charset.forName("windows-1252")}) {
            try {
                Path path = Paths.get(filePath);
                if (!Files.exists(path)) {
                    // Try absolute path relative to user.dir
                    path = Paths.get(System.getProperty("user.dir"), filePath);
                }
                if (!Files.exists(path)) {
                    return List.of("⚠ Log file not found at: " + Paths.get(filePath).toAbsolutePath());
                }

                List<String> all = new ArrayList<>();
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(new FileInputStream(path.toFile()), charset))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        // Replace non-printable chars to avoid JSON issues
                        all.add(line.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", ""));
                    }
                }

                int from = Math.max(0, all.size() - n);
                return all.subList(from, all.size());

            } catch (IOException e) {
                log.warn("Failed to read log with charset {}: {}", charset, e.getMessage());
            }
        }
        return List.of("Error: Could not read log file with any supported charset.");
    }
}
