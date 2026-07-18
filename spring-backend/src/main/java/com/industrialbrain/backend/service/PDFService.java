package com.industrialbrain.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
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

    private final OCRService ocrService;

    public PDFService(OCRService ocrService) {
        this.ocrService = ocrService;
    }

    public String extractText(String filePath) {

        try {



            String lowerPath = filePath.toLowerCase();

            if (lowerPath.endsWith(".png")
                    || lowerPath.endsWith(".jpg")
                    || lowerPath.endsWith(".jpeg")) {

                System.out.println("================================");
                System.out.println("IMAGE DETECTED");
                System.out.println(filePath);
                System.out.println("================================");

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
                    imageFile.delete();
                }

                return text;
            }

            PDDocument document;



            if (filePath.startsWith("http")) {

                System.out.println("================================");
                System.out.println("Reading PDF from Cloudinary");
                System.out.println(filePath);
                System.out.println("================================");

                URL url = new URL(filePath);

                try (InputStream inputStream = url.openStream()) {

                    byte[] pdfBytes = inputStream.readAllBytes();

                    document = Loader.loadPDF(pdfBytes);
                }

            }



            else {

                File file = new File(filePath);

                System.out.println("================================");
                System.out.println("Reading PDF from Local Storage");
                System.out.println(file.getAbsolutePath());
                System.out.println("Exists : " + file.exists());
                System.out.println("================================");

                document = Loader.loadPDF(file);
            }



            PDFTextStripper stripper = new PDFTextStripper();

            String text = stripper.getText(document);

            if (text != null && !text.isBlank()) {

                System.out.println("================================");
                System.out.println("PDF TEXT FOUND");
                System.out.println("TEXT LENGTH = " + text.length());
                System.out.println("================================");

                document.close();

                return text;
            }



            System.out.println("================================");
            System.out.println("No selectable text found.");
            System.out.println("Running OCR...");
            System.out.println("================================");

            PDFRenderer renderer = new PDFRenderer(document);

            StringBuilder ocrText = new StringBuilder();

            for (int page = 0; page < document.getNumberOfPages(); page++) {

                System.out.println("================================");
System.out.println("Processing Page : " + (page + 1));
System.out.println("================================");

                BufferedImage image = null;

File tempImage = null;

try {
    
    image = renderer.renderImage(page, 0.30f, ImageType.GRAY);

    tempImage =
            Files.createTempFile("ocr-page-" + page, ".png").toFile();

    ImageIO.write(image, "png", tempImage);

    image.flush();
    image = null;

    String pageText =
            ocrService.extractText(tempImage);

    ocrText.append(pageText).append("\n");

} finally {

    if (image != null) {
        image.flush();
    }

    if (tempImage != null && tempImage.exists()) {
        tempImage.delete();
    }

    System.gc();
}
            }

            document.close();

            System.gc();

            System.out.println("================================");
            System.out.println("OCR FINISHED");
            System.out.println("OCR TEXT LENGTH = " + ocrText.length());
            System.out.println("================================");

            return ocrText.toString();

        } catch (Exception e) {

            System.out.println("==============================");
            System.out.println("PDF EXTRACTION ERROR");
            System.out.println("==============================");

            e.printStackTrace();

            return "Error extracting PDF text.";
        }
    }
}