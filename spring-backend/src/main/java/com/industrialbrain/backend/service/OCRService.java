package com.industrialbrain.backend.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

@Service
public class OCRService {

    private static final Logger logger = LoggerFactory.getLogger(OCRService.class);

    @Value("${tesseract.datapath:}")
    private String tessDataPath;

    private final ImagePreprocessingService imagePreprocessingService;

    public OCRService(ImagePreprocessingService imagePreprocessingService) {
        this.imagePreprocessingService = imagePreprocessingService;
    }

    public String extractText(File imageFile) {

        try {

            logger.info("OCR started.");
            logger.info("Processing image: {}", imageFile.getAbsolutePath());

            // Read image
            BufferedImage originalImage = ImageIO.read(imageFile);

            // Preprocess image
            BufferedImage processedImage =
                    imagePreprocessingService.preprocess(originalImage);

            // Save processed image temporarily
            File processedFile =
                    File.createTempFile("processed-", ".png");

            ImageIO.write(processedImage, "png", processedFile);

            ITesseract tesseract = new Tesseract();

            String os = System.getProperty("os.name").toLowerCase();

            if (os.contains("win")) {
                tesseract.setDatapath(tessDataPath);
            } else {
                tesseract.setDatapath("/usr/share/tesseract-ocr/5/tessdata");
            }

            // Language
            tesseract.setLanguage("eng");

            // OCR Engine Mode
            tesseract.setOcrEngineMode(1);

            // Page Segmentation Mode
            tesseract.setPageSegMode(1);

            // OCR Optimization
            tesseract.setVariable("user_defined_dpi", "120");
            tesseract.setVariable("preserve_interword_spaces", "1");
            tesseract.setVariable("tessedit_do_invert", "0");

            String text = tesseract.doOCR(processedFile);

            processedImage.flush();
originalImage.flush();

            // Delete temporary processed image
            if (!processedFile.delete()) {
                logger.warn("Failed to delete temporary processed image: {}",
                        processedFile.getAbsolutePath());
            }

            logger.info("OCR completed successfully.");
            logger.info("OCR text length: {}", text.length());

            return text.trim();

        } catch (TesseractException e) {

            logger.error("OCR failed while processing image: {}",
                    imageFile.getAbsolutePath(), e);

            return "";

        } catch (Exception e) {

            logger.error("Unexpected error during OCR.", e);

            return "";
        }
    }
}