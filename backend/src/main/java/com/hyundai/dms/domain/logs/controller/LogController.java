package com.hyundai.dms.domain.logs.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

@Slf4j
@RestController
@RequestMapping("/v1/logs")
@Tag(name = "Log Viewer", description = "Admin-only log viewer")
public class LogController {

    private static final String LOG_FILE = "logs/dms-application.log";
    private static final String ERROR_LOG_FILE = "logs/dms-error.log";

    /**
     * Returns last N lines of the application log.
     * Only ADMIN can access.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(defaultValue = "200") int lines,
            @RequestParam(defaultValue = "application") String type) {

        String filePath = "error".equalsIgnoreCase(type) ? ERROR_LOG_FILE : LOG_FILE;
        List<String> logLines = readLastLines(filePath, lines);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("file", filePath);
        response.put("totalLines", logLines.size());
        response.put("lines", logLines);
        return ResponseEntity.ok(response);
    }

    /**
     * Returns log lines filtered by level (INFO, DEBUG, WARN, ERROR).
     */
    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> filterLogs(
            @RequestParam(defaultValue = "ERROR") String level,
            @RequestParam(defaultValue = "500") int lines) {

        List<String> all = readLastLines(LOG_FILE, 5000);
        List<String> filtered = all.stream()
                .filter(l -> l.contains(" " + level.toUpperCase() + " "))
                .collect(Collectors.toList());

        // return last N of filtered
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
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) return List.of("Log file not found: " + filePath);
        try {
            List<String> all = Files.readAllLines(path);
            int from = Math.max(0, all.size() - n);
            return all.subList(from, all.size());
        } catch (IOException e) {
            log.error("Failed to read log file: {}", e.getMessage());
            return List.of("Error reading log file: " + e.getMessage());
        }
    }
}
