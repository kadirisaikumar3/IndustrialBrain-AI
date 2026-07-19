package com.industrialbrain.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Service
public class PDFService {

    private static final Logger logger = LoggerFactory.getLogger(PDFService.class);

    private final OCRService ocrService;
private final ImagePreprocessingService imagePreprocessingService;

public PDFService(
        OCRService ocrService,
        ImagePreprocessingService imagePreprocessingService) {

    this.ocrService = ocrService;
    this.imagePreprocessingService = imagePreprocessingService;
}

    public String extractText(String filePath) {

        try {

            String lowerPath = filePath.toLowerCase();

            // ================= IMAGE OCR =================

            if (lowerPath.endsWith(".png")
                    || lowerPath.endsWith(".jpg")
                    || lowerPath.endsWith(".jpeg")) {

                logger.info("Image detected.");
                logger.info("Processing file: {}", filePath);

                File imageFile;

                if (filePath.startsWith("http")) {

                    URL url = new URL(filePath);

                    imageFile = Files
                            .createTempFile("ocr-image-", ".png")
                            .toFile();

                    try (InputStream inputStream = url.openStream()) {

                        Files.copy(
                                inputStream,
                                imageFile.toPath(),
                                StandardCopyOption.REPLACE_EXISTING
                        );
                    }

                } else {

                    imageFile = new File(filePath);
                }

                String text = ocrService.extractText(imageFile);

                if (imageFile.getName().startsWith("ocr-image-")) {
                    if (!imageFile.delete()) {
                        logger.warn("Failed to delete temporary image: {}", imageFile.getAbsolutePath());
                    }
                }

                return text;
            }

            // ================= LOAD PDF =================

            PDDocument document;

            if (filePath.startsWith("http")) {

                logger.info("Reading PDF from Cloudinary.");
                logger.info("PDF URL: {}", filePath);

                URL url = new URL(filePath);

                File tempPdf = Files
                        .createTempFile("cloudinary-pdf-", ".pdf")
                        .toFile();

                try (InputStream inputStream = url.openStream()) {

                    Files.copy(
                            inputStream,
                            tempPdf.toPath(),
                            StandardCopyOption.REPLACE_EXISTING
                    );
                }

                document = Loader.loadPDF(tempPdf);

            } else {

                document = Loader.loadPDF(new File(filePath));
            }

            // ================= SEARCHABLE PDF =================

            PDFTextStripper stripper = new PDFTextStripper();

            StringBuilder searchableText = new StringBuilder();

            boolean hasSelectableText = false;

            for (int page = 1; page <= document.getNumberOfPages(); page++) {

                stripper.setStartPage(page);
                stripper.setEndPage(page);

                String pageText = stripper.getText(document).trim();

                if (!pageText.isEmpty()) {

                    hasSelectableText = true;

                    searchableText.append("\n");
                    searchableText.append("========== PAGE ")
                            .append(page)
                            .append(" ==========\n\n");

                    searchableText.append(pageText);
                    searchableText.append("\n\n");
                }
            }

            if (hasSelectableText) {

                logger.info("Searchable PDF detected.");
                logger.info("Extracted text length: {}", searchableText.length());

                document.close();

                return searchableText.toString();
            }

            logger.info("Scanned PDF detected. Running OCR.");

            document.close();

            // ================= OCR PDF =================

            PDDocument ocrDocument;

            if (filePath.startsWith("http")) {

                URL url = new URL(filePath);

                File tempPdf = Files
                        .createTempFile("ocr-pdf-", ".pdf")
                        .toFile();

                try (InputStream inputStream = url.openStream()) {

                    Files.copy(
                            inputStream,
                            tempPdf.toPath(),
                            StandardCopyOption.REPLACE_EXISTING
                    );
                }

                ocrDocument = Loader.loadPDF(tempPdf);

            } else {

                ocrDocument = Loader.loadPDF(new File(filePath));
            }
                        PDFRenderer renderer = new PDFRenderer(ocrDocument);

            StringBuilder ocrText = new StringBuilder();

            for (int page = 0; page < ocrDocument.getNumberOfPages(); page++) {

                logger.info("Processing page {}", page + 1);

                BufferedImage image =
        renderer.renderImageWithDPI(
                page,
                120,
                ImageType.GRAY
        );

File tempImage = Files
        .createTempFile("page-" + (page + 1) + "-", ".png")
        .toFile();

ImageIO.write(image, "png", tempImage);

String pageText = ocrService.extractText(tempImage);

image.flush();
image = null;
                ocrText.append("\n");
                ocrText.append("========== PAGE ")
                        .append(page + 1)
                        .append(" ==========\n\n");

                ocrText.append(pageText);
                ocrText.append("\n\n");

                if (tempImage.exists()) {
                    if (!tempImage.delete()) {
                        logger.warn("Failed to delete temporary image: {}",
                                tempImage.getAbsolutePath());
                    }
                }
            }

            ocrDocument.close();

System.gc();

logger.info("OCR completed successfully.");
            logger.info("Extracted OCR text length: {}", ocrText.length());

            return ocrText.toString();

        } catch (Exception e) {

            logger.error("Error extracting PDF text.", e);

            return "Error extracting PDF text.";
        }
    }
}