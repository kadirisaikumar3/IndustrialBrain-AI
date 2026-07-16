package com.industrialbrain.backend.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OCRService {

    @Value("${tesseract.datapath:}")
private String tessDataPath;

    public String extractText(File imageFile) {

        try {

            System.out.println("================================");
            System.out.println("OCR STARTED");
            System.out.println("Image : " + imageFile.getAbsolutePath());
            System.out.println("================================");

            ITesseract tesseract = new Tesseract();

            String os = System.getProperty("os.name").toLowerCase();

if (os.contains("win")) {
    tesseract.setDatapath(tessDataPath);
} else {
    tesseract.setDatapath("/usr/share/tesseract-ocr/5/tessdata");
}

            tesseract.setLanguage("eng");

            String text = tesseract.doOCR(imageFile);

            System.out.println("================================");
            System.out.println("OCR TEXT LENGTH : " + text.length());
            System.out.println("================================");

            return text.trim();

        } catch (TesseractException e) {

            System.out.println("================================");
            System.out.println("OCR FAILED");
            System.out.println("================================");

            e.printStackTrace();

            return "";
        }
    }
}