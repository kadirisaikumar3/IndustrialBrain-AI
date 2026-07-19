package com.industrialbrain.backend.service;

import org.springframework.stereotype.Service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.awt.image.RescaleOp;

@Service
public class ImagePreprocessingService {

    public BufferedImage preprocess(BufferedImage original) {

        // Step 1: Convert to grayscale
        BufferedImage gray = new BufferedImage(
                original.getWidth(),
                original.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY);

        Graphics2D graphics = gray.createGraphics();
        graphics.drawImage(original, 0, 0, null);
        graphics.dispose();

        // Step 2: Increase contrast
        RescaleOp rescale = new RescaleOp(
                1.4f,
                15f,
                null);

        BufferedImage enhanced = new BufferedImage(
                gray.getWidth(),
                gray.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY);

        rescale.filter(gray, enhanced);

        // Step 3: Apply threshold (black & white)
        BufferedImage binary = new BufferedImage(
                enhanced.getWidth(),
                enhanced.getHeight(),
                BufferedImage.TYPE_BYTE_BINARY);

        Graphics2D g2 = binary.createGraphics();
        g2.drawImage(enhanced, 0, 0, null);
        g2.dispose();

        return binary;
    }
}