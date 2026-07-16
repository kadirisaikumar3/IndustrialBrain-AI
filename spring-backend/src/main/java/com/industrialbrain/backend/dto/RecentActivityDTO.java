package com.industrialbrain.backend.dto;

import java.time.LocalDateTime;

public class RecentActivityDTO {

    private String fileName;

    private String activity;

    private LocalDateTime time;

    public RecentActivityDTO() {
    }

    public RecentActivityDTO(
            String fileName,
            String activity,
            LocalDateTime time) {

        this.fileName = fileName;
        this.activity = activity;
        this.time = time;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

}