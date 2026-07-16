package com.industrialbrain.backend.dto;

public class DashboardStats {

    private long totalDocuments;

    private long pdfCount;

    private long imageCount;

    private String storageUsed;

    public DashboardStats() {
    }

    public DashboardStats(
            long totalDocuments,
            long pdfCount,
            long imageCount,
            String storageUsed) {

        this.totalDocuments = totalDocuments;
        this.pdfCount = pdfCount;
        this.imageCount = imageCount;
        this.storageUsed = storageUsed;
    }

    public long getTotalDocuments() {
        return totalDocuments;
    }

    public void setTotalDocuments(long totalDocuments) {
        this.totalDocuments = totalDocuments;
    }

    public long getPdfCount() {
        return pdfCount;
    }

    public void setPdfCount(long pdfCount) {
        this.pdfCount = pdfCount;
    }

    public long getImageCount() {
        return imageCount;
    }

    public void setImageCount(long imageCount) {
        this.imageCount = imageCount;
    }

    public String getStorageUsed() {
        return storageUsed;
    }

    public void setStorageUsed(String storageUsed) {
        this.storageUsed = storageUsed;
    }

}