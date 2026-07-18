package com.industrialbrain.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class GeminiService {

    private final GeminiClientProvider provider;

    // Gemini model
    @Value("${gemini.model}")
private String model;

    public GeminiService(GeminiClientProvider provider) {
        this.provider = provider;
    }

    public String askGemini(String prompt) {

        String[] keys = provider.getApiKeys();
        int startIndex = provider.getCurrentKeyIndex();

        for (int offset = 0; offset < keys.length; offset++) {

            int i = (startIndex + offset) % keys.length;

            if (provider.isOnCooldown(i)) {

                long seconds = provider.getRemainingCooldown(i) / 1000;

                System.out.println();
                System.out.println("----------------------------------");
                System.out.println("Skipping API Key #" + (i + 1));
                System.out.println("Cooldown Remaining : " + seconds + " sec");
                System.out.println("----------------------------------");

                continue;
            }

            String apiKey = keys[i];

            System.out.println();
            System.out.println("==================================");
            System.out.println("Using Gemini API Key #" + (i + 1));
            System.out.println("==================================");

            for (int attempt = 1; attempt <= 3; attempt++) {

                try {

                    Client client = provider.getClient(apiKey);

                    System.out.println("Model : " + model);
                    
                    GenerateContentResponse response =
        client.models.generateContent(
                model,
                prompt,
                null
        );

                    if (response != null
                            && response.text() != null
                            && !response.text().isBlank()) {

                        System.out.println("SUCCESS using API Key #" + (i + 1));

                        int nextIndex = (i + 1) % keys.length;
                        provider.setCurrentKeyIndex(nextIndex);

                        System.out.println("Next request will start from Key #" + (nextIndex + 1));

                        return response.text().trim();
                    }

                } catch (Exception e) {

                    String message = e.getMessage() == null ? "" : e.getMessage();

                    System.out.println(
                            "API Key #" + (i + 1)
                                    + " Attempt " + attempt
                                    + " -> " + message
                    );

                    String lower = message.toLowerCase();

                    // Quota exceeded
                    if (lower.contains("quota")
                            || lower.contains("429")
                            || lower.contains("too many requests")) {

                        provider.putOnCooldown(i, 15 * 60 * 1000);

                        System.out.println();
                        System.out.println("######################################");
                        System.out.println("API Key #" + (i + 1));
                        System.out.println("PUT ON 15 MINUTE COOLDOWN");
                        System.out.println("Switching to next API key...");
                        System.out.println("######################################");

                        break;
                    }

                    // Model unavailable
                    if (lower.contains("404")
                            || lower.contains("not found")
                            || lower.contains("no longer available")) {

                        provider.putOnCooldown(i, 24 * 60 * 60 * 1000);

                        System.out.println();
                        System.out.println("######################################");
                        System.out.println("API Key #" + (i + 1));
                        System.out.println("MODEL NOT AVAILABLE");
                        System.out.println("PUT ON 24 HOUR COOLDOWN");
                        System.out.println("Switching to next API key...");
                        System.out.println("######################################");

                        break;
                    }

                    // Invalid API key
                    if (lower.contains("401")
                            || lower.contains("unauthorized")
                            || lower.contains("authentication")) {

                        provider.putOnCooldown(i, 24 * 60 * 60 * 1000);

                        System.out.println();
                        System.out.println("######################################");
                        System.out.println("API Key #" + (i + 1));
                        System.out.println("INVALID API KEY");
                        System.out.println("PUT ON 24 HOUR COOLDOWN");
                        System.out.println("Switching to next API key...");
                        System.out.println("######################################");

                        break;
                    }

                    // Retry temporary server errors
                    if (lower.contains("503")
                            || lower.contains("unavailable")
                            || lower.contains("deadline")
                            || lower.contains("timeout")) {

                        try {
                            Thread.sleep(2000);
                        } catch (InterruptedException ignored) {
                            Thread.currentThread().interrupt();
                        }

                        continue;
                    }

                    return "Gemini Error: " + message;
                }
            }
        }

        return "All Gemini API keys are currently unavailable. Please try again in a few minutes.";
    }
}