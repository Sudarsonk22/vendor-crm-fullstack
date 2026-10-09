package com.example.vendor_crm.dto;

import jakarta.validation.constraints.NotBlank;

public class NameRequest {

    @NotBlank(message = "Name is required")
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}