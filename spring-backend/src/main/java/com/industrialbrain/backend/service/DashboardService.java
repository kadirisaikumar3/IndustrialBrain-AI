package com.industrialbrain.backend.service;

import com.industrialbrain.backend.dto.DashboardStats;
import com.industrialbrain.backend.dto.RecentActivityDTO;
import com.industrialbrain.backend.dto.UploadTrendDTO;
import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.entity.User;
import com.industrialbrain.backend.repository.DocumentRepository;

import org.springframework.stereotype.Service;

import java.time.format.TextStyle;
import java.util.*;

@Service
public class DashboardService {

    private final DocumentRepository documentRepository;

    public DashboardService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }



    public DashboardStats getStats(User user) {

        List<Document> documents = documentRepository.findByUser(user);

        long totalDocuments = documents.size();

        long pdfCount = documents.stream()
                .filter(doc ->
                        doc.getFileType() != null &&
                        doc.getFileType().contains("pdf"))
                .count();

        long imageCount = documents.stream()
                .filter(doc ->
                        doc.getFileType() != null &&
                        doc.getFileType().startsWith("image"))
                .count();

        long totalBytes = documents.stream()
                .mapToLong(Document::getFileSize)
                .sum();

        String storageUsed =
                String.format("%.2f MB",
                        totalBytes / (1024.0 * 1024.0));

        return new DashboardStats(
                totalDocuments,
                pdfCount,
                imageCount,
                storageUsed
        );
    }


    public List<UploadTrendDTO> getUploadTrend(User user) {

        Map<String, Long> uploads = new LinkedHashMap<>();

        uploads.put("Mon", 0L);
        uploads.put("Tue", 0L);
        uploads.put("Wed", 0L);
        uploads.put("Thu", 0L);
        uploads.put("Fri", 0L);
        uploads.put("Sat", 0L);
        uploads.put("Sun", 0L);

        List<Document> documents = documentRepository.findByUser(user);

        for (Document document : documents) {

            if (document.getUploadTime() != null) {

                String day = document.getUploadTime()
                        .getDayOfWeek()
                        .getDisplayName(
                                TextStyle.SHORT,
                                Locale.ENGLISH
                        );

                uploads.put(day, uploads.get(day) + 1);

            }

        }

        List<UploadTrendDTO> result = new ArrayList<>();

        uploads.forEach((day, count) ->
                result.add(new UploadTrendDTO(day, count))
        );

        return result;
    }


    public List<RecentActivityDTO> getRecentActivity(User user) {

        List<Document> documents = documentRepository.findByUser(user);

        documents.sort((d1, d2) ->
                d2.getUploadTime().compareTo(d1.getUploadTime()));

        return documents.stream()
                .limit(5)
                .map(document -> new RecentActivityDTO(
                        document.getFileName(),
                        "Document Uploaded",
                        document.getUploadTime()
                ))
                .toList();
    }

}