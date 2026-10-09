package com.example.vendor_crm.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {

    private int status;
    private String message;
    private Map<String, String> fieldErrors;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public ErrorResponse(int status, String message, Map<String, String> fieldErrors) {
        this.status = status;
        this.message = message;
        this.fieldErrors = fieldErrors;
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public Map<String, String> getFieldErrors() { return fieldErrors; }
    public LocalDateTime getTimestamp() { return timestamp; }
}