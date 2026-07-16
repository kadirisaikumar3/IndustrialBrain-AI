package com.industrialbrain.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiExplanationService {

    private static final String MODEL = "gemini-3.5-flash";

    private final GeminiClientProvider provider;

    public GeminiExplanationService(GeminiClientProvider provider) {
        this.provider = provider;
    }

    public String explainTopic(String topic) {

        String prompt = """
                You are an expert technical tutor.

                Explain the following topic in a simple and interview-focused manner.

                Format your answer as:

                Definition:
                ...

                Why it is important:
                ...

                Key points:
                - Point 1
                - Point 2
                - Point 3

                Real-world example:
                ...

                Interview tips:
                ...

                Topic:
                """ + topic;

        try {

            for (String apiKey : provider.getApiKeys()) {

                try {

                    Client client = provider.getClient(apiKey);

                    GenerateContentResponse response =
                            client.models.generateContent(
                                    MODEL,
                                    prompt,
                                    null
                            );

                    if (response.text() != null &&
                            !response.text().isBlank()) {

                        return response.text().trim();

                    }

                } catch (Exception e) {

                    String message = e.getMessage();

                    if (message != null &&
                            message.toLowerCase().contains("quota")) {

                        continue;

                    }

                    throw e;

                }

            }

            return """
                    All Gemini API keys have exhausted their quota.

                    Please try again later.
                    """;

        } catch (Exception e) {

            e.printStackTrace();

            return """
                    Unable to generate explanation.

                    Reason:

                    """ + e.getMessage();

        }

    }

}