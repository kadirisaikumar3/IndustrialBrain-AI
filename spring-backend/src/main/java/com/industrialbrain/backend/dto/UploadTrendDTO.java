package com.industrialbrain.backend.dto;

public class UploadTrendDTO {

    private String day;
    private long uploads;

    public UploadTrendDTO() {
    }

    public UploadTrendDTO(String day, long uploads) {
        this.day = day;
        this.uploads = uploads;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public long getUploads() {
        return uploads;
    }

    public void setUploads(long uploads) {
        this.uploads = uploads;
    }
}