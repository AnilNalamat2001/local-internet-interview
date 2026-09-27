package com.localinternetinterview.backend.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private String area;
    private String city;

    public LoginResponse() {
    }

    public LoginResponse(
            Long id,
            String name,
            String email,
            String area,
            String city) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.area = area;
        this.city = city;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}