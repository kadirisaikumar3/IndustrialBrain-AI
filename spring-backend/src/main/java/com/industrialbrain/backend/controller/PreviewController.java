package com.industrialbrain.backend.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/api")
public class PreviewController {

    @GetMapping("/preview/{fileName:.+}")
    public ResponseEntity<Resource> previewPdf(
            @PathVariable String fileName) {

        try {

            String uploadFolder =
                    System.getProperty("user.dir")
                            + File.separator
                            + "uploads";

            File file = new File(uploadFolder, fileName);

            if (!file.exists()) {

                return ResponseEntity.notFound().build();

            }

            Resource resource = new FileSystemResource(file);

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + file.getName() + "\""
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().build();

        }

    }

}