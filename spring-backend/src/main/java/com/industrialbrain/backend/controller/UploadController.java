package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.service.CloudinaryService;
import com.industrialbrain.backend.service.DocumentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class UploadController {

    private final DocumentService documentService;
    private final CloudinaryService cloudinaryService;

    public UploadController(
            DocumentService documentService,
            CloudinaryService cloudinaryService) {

        this.documentService = documentService;
        this.cloudinaryService = cloudinaryService;
    }

    // ==========================
    // Upload File
    // ==========================
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) {

        try {

            Map uploadResult = cloudinaryService.uploadFile(file);

System.out.println("========== CLOUDINARY RESPONSE ==========");
System.out.println(uploadResult);
System.out.println("=========================================");

String fileUrl = uploadResult.get("secure_url").toString();

            System.out.println("Cloudinary URL : " + fileUrl);

            Document document = new Document(
                    file.getOriginalFilename(),
                    fileUrl,
                    file.getContentType(),
                    file.getSize(),
                    LocalDateTime.now()
            );

            documentService.saveDocument(document);

            return ResponseEntity.ok("File uploaded successfully!");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(e.getMessage());

        }
    }

    // ==========================
    // Health Check
    // ==========================
    @GetMapping("/test")
    public String test() {
        return "IndustrialBrain AI Backend is Running Successfully!";
    }
}