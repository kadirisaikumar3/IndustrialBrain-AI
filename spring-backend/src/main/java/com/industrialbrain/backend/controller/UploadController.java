package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.entity.User;
import com.industrialbrain.backend.service.CloudinaryService;
import com.industrialbrain.backend.service.DocumentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


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

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {

            if (authentication == null ||
                    !(authentication.getPrincipal() instanceof User)) {

                return ResponseEntity.status(401)
                        .body("User not authenticated.");
            }

            User user = (User) authentication.getPrincipal();

            String filePath;

if (file.getSize() <= 10 * 1024 * 1024) {

    Map uploadResult = cloudinaryService.uploadFile(file);

    System.out.println("========== CLOUDINARY RESPONSE ==========");
    System.out.println(uploadResult);
    System.out.println("=========================================");

    filePath = uploadResult.get("secure_url").toString();

    System.out.println("Cloudinary URL : " + filePath);

} else {

    Path uploadDir = Paths.get("uploads");

    if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
    }

    String fileName = System.currentTimeMillis() + "_"
            + file.getOriginalFilename();

    Path destination = uploadDir.resolve(fileName);

    Files.copy(
            file.getInputStream(),
            destination,
            StandardCopyOption.REPLACE_EXISTING
    );

    filePath = destination.toAbsolutePath().toString();

    System.out.println("Local File Saved : " + filePath);
}
            Document document = new Document(
        file.getOriginalFilename(),
        filePath,
        file.getContentType(),
        file.getSize(),
        LocalDateTime.now()
);

            document.setUser(user);

            documentService.saveDocument(document);

            return ResponseEntity.ok("File uploaded successfully!");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/test")
    public String test() {
        return "IndustrialBrain AI Backend is Running Successfully!";
    }
}