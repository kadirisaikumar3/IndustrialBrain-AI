package com.industrialbrain.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map<String, Object> uploadFile(MultipartFile file) throws Exception {

        System.out.println("\n========== FILE DETAILS ==========");
        System.out.println("Original Filename : " + file.getOriginalFilename());
        System.out.println("Field Name        : " + file.getName());
        System.out.println("Content Type      : " + file.getContentType());
        System.out.println("Size              : " + file.getSize() + " bytes");
        System.out.println("Is Empty          : " + file.isEmpty());
        System.out.println("==================================");

        String resourceType = "raw";

        if (file.getContentType() != null &&
                file.getContentType().startsWith("image/")) {
            resourceType = "image";
        }

        // Remove extension from filename
        String originalFilename = file.getOriginalFilename();

        String publicId = originalFilename;

        if (originalFilename != null && originalFilename.contains(".")) {
            publicId = originalFilename.substring(
                    0,
                    originalFilename.lastIndexOf(".")
            );
        }

        System.out.println("Uploading as Resource Type : " + resourceType);
        System.out.println("Public ID : " + publicId);

        Map<String, Object> uploadResult =
                cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", resourceType,
                                "public_id", publicId,
                                "use_filename", true,
                                "unique_filename", false,
                                "overwrite", true
                        )
                );

        System.out.println("\n========== CLOUDINARY RESPONSE ==========");

        uploadResult.forEach((key, value) ->
                System.out.println(key + " : " + value)
        );

        System.out.println("=========================================\n");

        return uploadResult;
    }
}